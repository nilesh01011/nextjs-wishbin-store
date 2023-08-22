/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-undef */
import Head from 'next/head'
import { NextStudio } from 'next-sanity/studio'
import { metadata } from 'next-sanity/studio/metadata'
import config from '../../sanity.config'
import { redirect } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

export default function StudioPage() {

  const userIsAdmin = useSelector((state) => state.user);

  useEffect(() => {
    if (!userIsAdmin.isAdmin) {
      console.log('user is not an admin')
      redirect('/error')
    } else {
      console.log('user is admin');
    }
  }, [])

  return (
    <>
      <Head>
        {Object.entries(metadata).map(([key, value]) => (
          <meta key={key} name={key} content={value} />
        ))}
      </Head>
      <NextStudio config={config} />
    </>
  )
}