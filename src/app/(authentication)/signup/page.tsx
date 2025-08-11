'use client'

import Link from 'next/link'
import { RegisterForm } from './form'

export default function RegisterPage() {

  return (
    <>
      <main className="flex items-center justify-center">
        <div className="container max-w-lg mx-auto p-8 bg-white   rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
            Create Your Account
          </h2>
          <RegisterForm />

          <Link href="/signin" className="block text-center text-blue-600 hover:underline font-medium">
            Login with existing account
          </Link>
        </div>
      </main>
    </>
  )
}
