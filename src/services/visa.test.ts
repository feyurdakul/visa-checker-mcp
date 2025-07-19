import { beforeEach, describe, expect, it } from 'vitest'
import { VisaCenterSchema, VisaService } from './visa.js'

describe('VisaService', () => {
  beforeEach(() => {
    // Clear cache before each test
    VisaService['cachedData'] = null
    VisaService['lastFetch'] = null
  })

  it('should validate visa center schema', () => {
    const validVisaCenter = {
      id: 'visa_001',
      country_code: 'tur',
      mission_code: 'nld',
      status: 'open',
      visa_type: 'Tourism',
      center: 'Netherlands Visa Application Centre - Istanbul',
      last_available_date: '2024-08-15',
      tracking_count: 1250,
    }

    const result = VisaCenterSchema.safeParse(validVisaCenter)
    expect(result.success).toBe(true)
  })

  it('should reject invalid country code', () => {
    const invalidVisaCenter = {
      id: 'visa_001',
      country_code: 'invalid',
      mission_code: 'nld',
      status: 'open',
      visa_type: 'Tourism',
      center: 'Netherlands Visa Application Centre - Istanbul',
      last_available_date: '2024-08-15',
      tracking_count: 1250,
    }

    const result = VisaCenterSchema.safeParse(invalidVisaCenter)
    expect(result.success).toBe(false)
  })

  it('should filter visa data correctly', () => {
    const mockData = {
      success: true,
      visas: [
        {
          id: 'visa_001',
          country_code: 'tur',
          mission_code: 'nld',
          status: 'open',
          visa_type: 'Tourism',
          center: 'Netherlands Visa Application Centre - Istanbul',
          last_available_date: '2024-08-15',
          tracking_count: 1250,
        },
        {
          id: 'visa_002',
          country_code: 'tur',
          mission_code: 'fra',
          status: 'closed',
          visa_type: 'Business',
          center: 'France Visa Application Centre - Istanbul',
          last_available_date: null,
          tracking_count: 890,
        },
        {
          id: 'visa_003',
          country_code: 'are',
          mission_code: 'nld',
          status: 'open',
          visa_type: 'Tourism',
          center: 'Netherlands Visa Application Centre - Dubai',
          last_available_date: '2024-08-20',
          tracking_count: 2100,
        },
      ],
    } as const

    const filtered = VisaService.filterVisaData(mockData, {
      country_code: 'tur',
    })

    expect(filtered).toHaveLength(2)
    expect(filtered.every(visa => visa.country_code === 'tur')).toBe(true)
  })

  it('should get open appointments only', () => {
    const mockData = {
      success: true,
      visas: [
        {
          id: 'visa_001',
          country_code: 'tur',
          mission_code: 'nld',
          status: 'open',
          visa_type: 'Tourism',
          center: 'Netherlands Visa Application Centre - Istanbul',
          last_available_date: '2024-08-15',
          tracking_count: 1250,
        },
        {
          id: 'visa_002',
          country_code: 'tur',
          mission_code: 'fra',
          status: 'closed',
          visa_type: 'Business',
          center: 'France Visa Application Centre - Istanbul',
          last_available_date: null,
          tracking_count: 890,
        },
      ],
    } as const

    const openAppointments = VisaService.getOpenAppointments(mockData)

    expect(openAppointments).toHaveLength(1)
    expect(openAppointments[0].status).toBe('open')
  })

  it('should format visa center correctly', () => {
    const visaCenter = {
      id: 'visa_001',
      country_code: 'tur',
      mission_code: 'nld',
      status: 'open',
      visa_type: 'Tourism',
      center: 'Netherlands Visa Application Centre - Istanbul',
      last_available_date: '2024-08-15',
      tracking_count: 1250,
    } as const

    const formatted = VisaService.formatVisaCenter(visaCenter)

    expect(formatted).toContain('🟢')
    expect(formatted).toContain(
      'Netherlands Visa Application Centre - Istanbul'
    )
    expect(formatted).toContain('TUR → NLD')
    expect(formatted).toContain('Tourism')
    expect(formatted).toContain('OPEN')
    expect(formatted).toContain('1250 users')
    expect(formatted).toContain('2024-08-15')
  })
})
