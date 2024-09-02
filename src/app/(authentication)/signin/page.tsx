'use client'

import Link from 'next/link'
import { LoginForm } from './form'

export default function LoginPage() {
  return (
    <>

      <main className="flex items-center justify-center">
        <div className="container max-w-lg mx-auto p-8 bg-white   rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
            Create Your Account
          </h2>
          <LoginForm />
          <Link  className="block text-center p-4 text-blue-600 hover:underline font-medium" href="/signup">
            Create New Account
          </Link>
        </div>
      </main>


    </>

  )
}