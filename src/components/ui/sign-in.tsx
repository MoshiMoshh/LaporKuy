"use client";

import * as React from "react"
import { cn } from "@/lib/utils"

const GoogleIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src="https://svgl.app/library/google.svg" alt="Google" {...props} />
)

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onEmailSubmit?: (data: { email: string; password?: string }) => void
  onSocialSignIn?: (provider: 'google') => void
  onEmailLink?: () => void
  isLoading?: boolean
}

const AuthForm = React.forwardRef<HTMLDivElement, AuthFormProps>(
  ({ className, onEmailSubmit, onSocialSignIn, onEmailLink, isLoading, ...props }, ref) => {

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const formData = new FormData(event.currentTarget)
      const email = formData.get("email") as string
      const password = formData.get("password") as string
      onEmailSubmit?.({ email, password })
    }

    return (
      <div 
        ref={ref} 
        className={cn(
          "w-full max-w-md mx-auto bg-[#FFFFFF] border border-[#EAEAEA] rounded-[8px] p-8 sm:p-10", 
          className
        )} 
        {...props}
      >
        <div className="text-left mb-8">
          <h1 className="text-[24px] font-medium tracking-tight text-[#111111] mb-2" style={{ fontFamily: "'Playfair Display', 'Lyon Text', 'Newsreader', serif", letterSpacing: "-0.02em", lineHeight: "1.1" }}>
            Masuk ke LaporKuy
          </h1>
          <p className="text-[14px] leading-[1.6] text-[#787774]">
            Akses dashboard pelaporan dan pantau dampak kotamu.
          </p>
        </div>
        
        <div className="space-y-6">
          <button 
            type="button" 
            className="w-full flex items-center justify-center gap-2 h-10 border border-[#EAEAEA] rounded-[4px] text-[14px] font-medium text-[#111111] hover:bg-[#F7F6F3] transition-colors"
            onClick={() => onSocialSignIn?.('google')} 
            disabled={isLoading}
          >
            <GoogleIcon className="w-[14px] h-[14px]" />
            Lanjutkan dengan Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#EAEAEA]" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-[0.05em]">
              <span className="bg-[#FFFFFF] px-3 text-[#787774]">atau dengan email</span>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-[13px] font-medium text-[#111111]">
                Email
              </label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="nama@email.com" 
                className="w-full h-10 px-3 text-[14px] bg-[#FFFFFF] border border-[#EAEAEA] rounded-[4px] focus:outline-none focus:border-[#111111] transition-colors placeholder:text-[#A0A0A0]" 
                required 
                disabled={isLoading} 
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-[13px] font-medium text-[#111111]">
                  Password
                </label>
                <a href="#" className="text-[12px] font-medium text-[#787774] hover:text-[#111111] transition-colors">
                  Lupa password?
                </a>
              </div>
              <input 
                id="password" 
                name="password" 
                type="password" 
                className="w-full h-10 px-3 text-[14px] bg-[#FFFFFF] border border-[#EAEAEA] rounded-[4px] focus:outline-none focus:border-[#111111] transition-colors" 
                required 
                disabled={isLoading} 
              />
            </div>
            <button 
              type="submit" 
              className="w-full h-10 bg-[#111111] hover:bg-[#333333] text-[#FFFFFF] rounded-[4px] text-[14px] font-medium transition-transform active:scale-[0.98] mt-2" 
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Masuk Sekarang'}
            </button>
          </form>
          
          <div className="pt-2">
             <button 
                type="button" 
                className="w-full text-center text-[13px] text-[#787774] hover:text-[#111111] transition-colors" 
                onClick={() => onEmailLink?.()} 
                disabled={isLoading}
              >
                Atau kirim link masuk via email
              </button>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-[#EAEAEA]">
          <p className="text-[13px] text-[#787774] text-center w-full">
            Belum punya akun?{' '}
            <a href="/register" className="text-[#111111] font-medium hover:underline">
              Daftar Sekarang
            </a>
          </p>
        </div>
      </div>
    )
  }
)
AuthForm.displayName = "AuthForm"

export { AuthForm }
