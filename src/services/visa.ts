import { z } from 'zod'
import { logger } from '@/utils/logger.js'

export const VisaCenterSchema = z.object({
  id: z.string(),
  country_code: z.string().regex(/^[a-z]{3}$/),
  mission_code: z.string().regex(/^[a-z]{3}$/),
  status: z.enum(['open', 'closed', 'waitlist_open', 'waitlist_closed']),
  visa_type: z.string(),
  center: z.string(),
  last_available_date: z.string().nullable(),
  tracking_count: z.number().min(0),
})

export const VisaApiResponseSchema = z.object({
  success: z.boolean(),
  summary: z
    .object({
      total_results: z.number(),
      status_breakdown: z.record(z.number()),
      countries: z.array(z.string()),
      missions: z.array(z.string()),
      last_updated: z.string(),
    })
    .optional(),
  visas: z.array(VisaCenterSchema),
  filters_applied: z
    .object({
      country_code: z.string().nullable(),
      mission_code: z.string().nullable(),
      status: z.string().nullable(),
      visa_type: z.string().nullable(),
    })
    .optional(),
})

export type VisaCenter = z.infer<typeof VisaCenterSchema>
export type VisaApiResponse = z.infer<typeof VisaApiResponseSchema>

export class VisaService {
  private static readonly API_BASE_URL = 'https://api.visasbot.com'
  private static cachedData: VisaApiResponse | null = null
  private static lastFetch: Date | null = null
  private static readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

  static async fetchVisaList(params?: {
    country_code?: string
    mission_code?: string
    status?: 'open' | 'closed' | 'waitlist_open' | 'waitlist_closed'
    visa_type?: string
  }): Promise<VisaApiResponse> {
    try {
      const url = new URL('/api/visa/list', this.API_BASE_URL)

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value) url.searchParams.append(key, value)
        })
      }

      logger.info(`Fetching visa data from: ${url.toString()}`)

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'visa-checker-mcp/1.0.0',
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })

      if (!response.ok) {
        const errorMessage = `API returned ${response.status} ${response.statusText}`
        logger.error(errorMessage)
        throw new Error(errorMessage)
      }

      const data = await response.json()
      const validatedData = VisaApiResponseSchema.parse(data)

      // Update cache
      this.cachedData = validatedData
      this.lastFetch = new Date()

      logger.info(
        `Successfully fetched ${validatedData.visas.length} visa centers`
      )
      return validatedData
    } catch (error) {
      logger.error('Error fetching visa data:', error)

      // Return cached data if available when API fails
      if (this.cachedData && error instanceof Error) {
        logger.info('API failed, returning cached data')
        throw new Error(
          `API unavailable (${error.message}). Please try again later or check if cached data is available.`
        )
      }

      throw error
    }
  }

  static async getCachedVisaList(): Promise<VisaApiResponse | null> {
    if (this.isCacheValid()) {
      logger.info('Returning cached visa data')
      return this.cachedData
    }
    return null
  }

  static async getVisaListWithCache(params?: {
    country_code?: string
    mission_code?: string
    status?: 'open' | 'closed' | 'waitlist_open' | 'waitlist_closed'
    visa_type?: string
  }): Promise<VisaApiResponse> {
    // If no filters and cache is valid, return cached data
    if (!params && this.isCacheValid()) {
      return this.cachedData!
    }

    try {
      // Try to fetch fresh data
      return await this.fetchVisaList(params)
    } catch (error) {
      // If API fails and we have cached data, return it with a warning
      if (this.cachedData) {
        logger.info('API failed, falling back to cached data')
        return {
          ...this.cachedData,
          summary: this.cachedData.summary
            ? {
                ...this.cachedData.summary,
                last_updated: `${this.cachedData.summary.last_updated} (cached - API unavailable)`,
              }
            : undefined,
        }
      }
      throw error
    }
  }

  static filterVisaData(
    data: VisaApiResponse,
    filters: {
      country_code?: string
      mission_code?: string
      status?: string
      visa_type?: string
    }
  ): VisaCenter[] {
    let filtered = data.visas

    if (filters.country_code) {
      filtered = filtered.filter(
        visa =>
          visa.country_code.toLowerCase() ===
          filters.country_code!.toLowerCase()
      )
    }

    if (filters.mission_code) {
      filtered = filtered.filter(
        visa =>
          visa.mission_code.toLowerCase() ===
          filters.mission_code!.toLowerCase()
      )
    }

    if (filters.status) {
      filtered = filtered.filter(visa => visa.status === filters.status)
    }

    if (filters.visa_type) {
      filtered = filtered.filter(visa =>
        visa.visa_type.toLowerCase().includes(filters.visa_type!.toLowerCase())
      )
    }

    return filtered
  }

  static getOpenAppointments(data: VisaApiResponse): VisaCenter[] {
    return data.visas.filter(visa => visa.status === 'open')
  }

  static getVisaCentersByCountry(
    data: VisaApiResponse,
    countryCode: string
  ): VisaCenter[] {
    return data.visas.filter(
      visa => visa.country_code.toLowerCase() === countryCode.toLowerCase()
    )
  }

  static getVisaCentersByMission(
    data: VisaApiResponse,
    missionCode: string
  ): VisaCenter[] {
    return data.visas.filter(
      visa => visa.mission_code.toLowerCase() === missionCode.toLowerCase()
    )
  }

  static formatVisaCenter(visa: VisaCenter): string {
    const statusEmoji = {
      open: '🟢',
      closed: '🔴',
      waitlist_open: '🟡',
      waitlist_closed: '🟠',
    }

    return `${statusEmoji[visa.status]} ${visa.center}
📍 ${visa.country_code.toUpperCase()} → ${visa.mission_code.toUpperCase()}
📋 Type: ${visa.visa_type}
📊 Status: ${visa.status.replace('_', ' ').toUpperCase()}
👥 Tracking: ${visa.tracking_count} users
📅 Last Available: ${visa.last_available_date || 'Never'}`
  }

  private static isCacheValid(): boolean {
    if (!this.cachedData || !this.lastFetch) return false
    const now = new Date()
    return now.getTime() - this.lastFetch.getTime() < this.CACHE_DURATION
  }
}
