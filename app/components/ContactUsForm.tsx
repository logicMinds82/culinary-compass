'use client';
import { useState, FormEvent } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function ContactUsForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!executeRecaptcha) {
      setStatus('reCAPTCHA is not yet available.');
      return;
    }

    const token = await executeRecaptcha('contact_us');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, token }),
      });

      if (!res.ok) throw new Error('Something went wrong');

      setName('');
      setEmail('');
      setMessage('');
      setStatus('Your message has been sent successfully!');

      setTimeout(() => setStatus(null), 5000);
    } catch {
      setStatus('Failed to send message. Please try again later.');
    }
  };

  return (
    <section className="w-full min-h-screen bg-background py-16">
      <div className="max-w-3xl mx-auto px-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-4xl">Contact Us</CardTitle>
            <CardDescription>We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            {status && (
              <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
                status.includes('success') 
                  ? 'bg-success/10 border border-success/20 text-success' 
                  : 'bg-destructive/10 border border-destructive/20 text-destructive'
              }`}>
                {status.includes('success') ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="font-semibold">{status}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={6}
                  placeholder="Your Message"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="bg-primary hover:bg-primary-hover w-full sm:w-auto"
              >
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
