import React, { useState } from 'react'
import { testimonials, assets } from '../../assets/assets.js'
import { useClerk } from '@clerk/clerk-react'
import LoggedOutNavbar from './LoggedOutNavbar.jsx';

//Disclaimer: This component was generated using AI and integrated within this project.

const LandingPage = () => {

    const { openSignIn } = useClerk();

    const handleSignInClick = ()=>{

        openSignIn({});

    }

    const StarRating = ({ rating }) => {
        return (
            <div className="flex justify-center space-x-1">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

            {/* Navigation */}
            <LoggedOutNavbar/>

            {/* Hero Section */}
            <div className="mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-5 pt-20 pb-16 text-center">

                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                    Experience the Power of
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"> Quick GPT</span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                    The fastest, most intuitive AI assistant that helps you write, create, and think smarter.
                </p>

                <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
                    Join thousands of users who are boosting their productivity with our advanced AI technology.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                    <button onClick={()=>handleSignInClick()} className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
                        Get Started Free
                    </button>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-25 max-w-2xl mx-auto">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">10K+</div>
                        <div className="text-gray-600">Active Users</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">99.9%</div>
                        <div className="text-gray-600">Uptime</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">24/7</div>
                        <div className="text-gray-600">Support</div>
                    </div>
                </div>

            </div>



            {/* Testimonials Section */}
            <div id="testimonials" className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Join thousands of satisfied users worldwide</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
                                <StarRating rating={testimonial.rating} />
                                <p className="text-gray-600 mt-4 mb-6 italic">"{testimonial.content}"</p>
                                <div className="flex items-center">
                                    <img className="w-12 h-12 rounded-full object-cover" src={testimonial.image} alt={testimonial.name} />
                                    <div className="ml-4">
                                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                        <div className="text-gray-500 text-sm">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div id="faq" className="bg-gray-50 py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <p className="text-xl text-gray-600">Everything you need to know about Quick GPT</p>
                    </div>

                    <div className="space-y-8">
                        {[
                            {
                                question: "How does Quick GPT differ from other AI assistants?",
                                answer: "Quick GPT focuses on speed and accuracy, with optimized models that provide instant responses while maintaining high-quality output. Our proprietary technology ensures faster processing times without compromising on intelligence."
                            },
                            {
                                question: "Is my data safe and private?",
                                answer: "Absolutely. We employ end-to-end encryption and never share your data with third parties. Your conversations are private and secure, with options for data deletion at any time."
                            },
                            {
                                question: "Can I use Quick GPT for commercial purposes?",
                                answer: "Yes! Our Pro and Team plans include commercial usage rights. You can use Quick GPT to generate content, code, and other materials for your business needs."
                            },
                            {
                                question: "What languages does Quick GPT support?",
                                answer: "We support over 50 languages with accurate translation and context understanding. This includes major languages like English, Spanish, French, German, Chinese, Japanese, and many more."
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                                <p className="text-gray-600">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Final CTA Section */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-16">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of users transforming their workflow with Quick GPT. No credit card required.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={()=>handleSignInClick()} className="cursor-pointer bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105">
                            Get Started Free
                        </button>
                    </div>
                    <p className="text-blue-200 mt-4 text-sm">Free plan includes 100 messages per month • No credit card required</p>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  gap-5">

                    <div className='flex flex-col sm:flex-row items-center justify-between sm:px-25 gap-5'>
                        <img className='w-50' src={assets.logo_full} alt="" />

                        <div className="flex flex-wrap gap-10 items-center p-5">

                            <div>
                                <h4 className="font-semibold mb-4">Product</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-4">Company</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-4">Support</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                                </ul>
                            </div>

                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 Quick GPT. All rights reserved.</p>
                    </div>

                </div>

            </footer>
        </div>
    );
}

export default LandingPage