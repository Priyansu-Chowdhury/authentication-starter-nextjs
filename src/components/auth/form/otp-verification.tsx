"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormDescription,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import ErrorMessage from "@/components/ui/error-message";
import { motion, AnimatePresence } from "framer-motion";
import SuccessMessage from "@/components/ui/success-message";

const OtpVerificationForm = () => {
  const { data: session } = useSession();
  const [otp, setOtp] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [time, setTime] = useState<number>(300);
  const [isResendEnabled, setIsResendEnabled] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const emailVerified = useMemo(() => {
    return session?.user?.emailVerified;
  }, [session]);

  useEffect(() => {
    if (!isVerified) {
      setOtp(null);
      setTime(300);
      setIsResendEnabled(false);
    }
  }, [isVerified]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (time > 0 && isVerified && !emailVerified) {
      timer = setTimeout(() => setTime((prev) => prev - 1), 1000);
    } else if (time === 0 && isVerified) {
      setIsResendEnabled(true);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [time, isVerified, emailVerified]);

  const handleResend = () => {
    setTime(300);
    setIsResendEnabled(false);
  };

  const handleVerify = () => {
    try {
      if (otp && otp.length === 6) {
        console.log("OTP Verified:", otp);
        setSuccess("Email verified successfully.");
        setOtp(null);
      } else {
        setError("Invalid OTP entered. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
    }
  };

  return (
    <div className="border shadow rounded-md p-4 bg-white flex flex-col space-y-4">
      <div className="justify-between items-start flex">
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={isVerified}
              onCheckedChange={() => setIsVerified(!isVerified)}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              {emailVerified
                ? "Email has been verified"
                : "Verify your email address"}
            </FormLabel>
            <FormDescription>
              {emailVerified
                ? "Your email address has been verified. You can now proceed to the next step."
                : "We have sent an OTP to your email address. Please enter the OTP below to verify your email address."}
            </FormDescription>
          </div>
        </FormItem>
        <Button
          type="button"
          variant="outline"
          disabled={!!emailVerified}
          onClick={isResendEnabled ? handleResend : handleVerify}
        >
          {isResendEnabled ? "Send Again" : "Verify"}
        </Button>
      </div>
      {!emailVerified && (
        <FormItem hidden={!isVerified || emailVerified}>
          <FormLabel>Enter OTP</FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder="Enter 6-digit OTP"
              className="tracking-widest"
              value={otp || ""}
              onChange={(e) => {
                if (e.target.value.length <= 6) {
                  setOtp(e.target.value);
                }
              }}
              disabled={!isVerified}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
      {!emailVerified && isVerified && (
        <p className="text-sm text-gray-500">
          {isResendEnabled ? "OTP expired." : `Time left: ${time}s`}
        </p>
      )}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.3 }}
          >
            <ErrorMessage message={error} />
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.3 }}
          >
            <SuccessMessage message={success} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OtpVerificationForm;
