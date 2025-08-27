import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { useRef } from 'react'

interface Props {
  oneTimePin: string
  confirmationTokenLoading: boolean
  onOneTimePinChange: (value: string) => void
  onOneTimePinSubmit: (e: React.FormEvent) => void
  onBackToLogin: () => void
  maxLength?: number
}

const OneTimePin = ({ oneTimePin, confirmationTokenLoading, onOneTimePinChange, onOneTimePinSubmit, onBackToLogin, maxLength = 6 }: Props) => {
  const formRef = useRef<HTMLFormElement>(null)

  const submitIfComplete = (value: string) => {
    if (value.length === maxLength) {
      setTimeout(() => formRef.current?.requestSubmit(), 0)
    }
  }

  const handleChange = (value: string) => {
    const next = value.replace(/\D/g, '').slice(0, maxLength)
    onOneTimePinChange(next)
    submitIfComplete(next)
  }

  const handlePaste: React.ClipboardEventHandler<HTMLDivElement> = (e) => {
    const text = e.clipboardData.getData('text') ?? ''
    const digits = text.replace(/\D/g, '').slice(0, maxLength)
    if (digits.length) {
      e.preventDefault()
      onOneTimePinChange(digits)
      submitIfComplete(digits)
    }
  }

  const isComplete = oneTimePin.length === maxLength

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">One-Time PIN</CardTitle>
        <CardDescription>Enter the one-time PIN sent to you.</CardDescription>
      </CardHeader>

      <form ref={formRef} onSubmit={onOneTimePinSubmit}>
        <CardContent className="flex justify-center" onPaste={handlePaste}>
          <InputOTP disabled={confirmationTokenLoading} maxLength={maxLength} value={oneTimePin} onChange={handleChange}>
            <InputOTPGroup>
              {Array.from({ length: maxLength }).map((_, i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button type="submit" className="w-full bg-waterboy-600 hover:bg-waterboy-700" disabled={confirmationTokenLoading || !isComplete}>
            {!isComplete ? 'Incomplete' : confirmationTokenLoading ? 'Verifying...' : 'Verify'}
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={onBackToLogin} disabled={confirmationTokenLoading}>
            Back to login
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default OneTimePin
