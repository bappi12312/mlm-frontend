"use client"

import React, { useEffect } from 'react'
import SalesCard from '../share/SalesCard'
import { useUserActions } from '@/lib/store/hooks/useUserActions'

const AffiliateSales = () => {
  const { getAffiliateSales} = useUserActions()

  useEffect(() => {
   async function fetchData() {
      await getAffiliateSales()
    }
    fetchData()
  }, [getAffiliateSales])

  return (
    <div className='container mx-auto flex justify-center items-center'>
      <h1 className='text-3xl font-semibold text-main'>Affiliate Sales</h1>
      <div>
        <SalesCard />
      </div>
    </div>
  )
}

export default AffiliateSales