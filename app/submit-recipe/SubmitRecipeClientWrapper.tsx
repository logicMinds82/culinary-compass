"use client";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import SubmitRecipeForm from "../components/SubmitRecipeForm";

export default function SubmitRecipeClientWrapper() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}>
      <SubmitRecipeForm />
    </GoogleReCaptchaProvider>
  );
}
