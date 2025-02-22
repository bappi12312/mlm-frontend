"use client"

import React, {  useEffect } from 'react'
// import SalesCard from '../share/SalesCard'
import { useUserActions } from '@/lib/store/hooks/useUserActions'
import { getAuthFromCookies } from '@/lib/utils/cookieUtils'

const AffiliateSales = () => {
  const { getAffiliateSales} = useUserActions()
  const {user} = getAuthFromCookies()

  useEffect(() => {
   async function fetchData() {
      await getAffiliateSales(user?._id)
    }
    fetchData()
  }, [getAffiliateSales])

  return (
    <div className='container mx-auto flex justify-center items-center'>
      <h1 className='text-3xl font-semibold text-main'>Affiliate Sales</h1>
      <div>
        {/* <SalesCar /> */}
      </div>
    </div>
  )
}

export default AffiliateSales