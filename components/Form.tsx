"use client"
import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import Image from "next/image";

export default function ContactForm() {
  const [subject, setSubject] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData();
    data.append("access_key", "2b0e1519-60e6-42c9-92e6-61e737c5ead5");
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("message", formData.message);
    data.append("subject", subject);

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(Object.fromEntries(data))
    });

    const result = await response.json();
    if (result.success) {
      setSuccessMessage("Thank you! We will get back to you soon.");
      setFormData({ name: '', email: '', message: '' });
      setSubject('');
    }
  }

  return (
    <section className="min-h-screen bg-[#f5e4d3] flex items-center justify-center p-6 md:p-12">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Section */}
        <div className="relative bg-black text-white p-10 rounded-lg shadow-lg flex flex-col items-center justify-center h-auto">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2220%22 cy=%2230%22 r=%2215%22 fill=%22none%22 stroke=%22%23ffffff%22 stroke-width=%222%22 stroke-dasharray=%226 6%22/%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2220%22 fill=%22none%22 stroke=%22%23ffffff%22 stroke-width=%222%22 stroke-dasharray=%226 6%22/%3E%3Ccircle cx=%2280%22 cy=%2230%22 r=%2210%22 fill=%22none%22 stroke=%22%23ffffff%22 stroke-width=%222%22 stroke-dasharray=%226 6%22/%3E%3C/svg%3E')] opacity-10"></div>
          <div className="relative z-10 text-center">
            <div className="text-sm uppercase tracking-widest mb-2">Indian Tufted Carpets</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-12">
              We’d love to<br />hear from you
            </h1>
            <Image
              src="/assets/products/hand.webp"
              alt="Decorative Carpet"
              width={300}
              height={350}
              className="mx-auto rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <nav className="flex justify-end mb-4 space-x-4">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">About</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Services</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Contact us</a>
          </nav>
          <h2 className="text-3xl font-semibold mb-6">Contact us</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="col-span-2">
              <label htmlFor="name" className="block text-sm text-gray-500">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
                className="w-full mt-1 p-2 border-b border-gray-300 focus:outline-none focus:border-burgundy"
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="email" className="block text-sm text-gray-500">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                className="w-full mt-1 p-2 border-b border-gray-300 focus:outline-none focus:border-burgundy"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Subject</label>
              <Select value={subject} onValueChange={(val) => setSubject(val)} required>
                <SelectTrigger className="w-full border-b border-gray-300 focus:outline-none focus:border-burgundy">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inquiry">General Inquiry</SelectItem>
                  <SelectItem value="quote">Request Quote</SelectItem>
                  <SelectItem value="custom">Custom Design</SelectItem>
                  <SelectItem value="bulk">Bulk Order</SelectItem>
                  <SelectItem value="export">Export Services</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm text-gray-500">Message</label>
              <textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Enter your message"
                rows={4}
                className="w-full mt-1 p-2 border-b border-gray-300 focus:outline-none focus:border-burgundy"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-[#644d26] text-white rounded-md hover:bg-burgundy-dark transition-colors cursor-pointer"
            >
              Submit →
            </button>
          </form>

          {successMessage && (
            <p className="mt-4 text-green-600 font-medium">{successMessage}</p>
          )}

          <div className="mt-6 text-sm text-gray-500">
            <p>Email us</p>
            <p className="mt-2">indiantuftedcarpets@gmail.com</p>
          </div>
        </div>
      </div>
    </section>
  );
}
