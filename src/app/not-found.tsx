import Link from 'next/link'
import { Home, Rocket, Mail } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white dark:bg-neutral-900/20 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-neutral-700">
                <div className="p-8 text-center">
                    <div className="mb-6">
                        <span className="text-9xl font-bold text-green-600 dark:text-green-500">404</span>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-4">Page Not Found</h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Oops! The page you're looking for doesn't exist or has been moved.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl dark:bg-green-700 dark:hover:bg-green-800"
                        >
                            <Home className="text-lg" />
                            Return Home
                        </Link>

                        <Link
                            href="/products"
                            className="flex items-center justify-center gap-2 px-6 py-3 border border-green-600 text-green-600 hover:bg-green-50 font-medium rounded-lg transition-all duration-300 dark:border-green-500 dark:text-green-500 dark:hover:bg-neutral-700"
                        >
                            <Rocket className="text-lg" />
                            Explore More
                        </Link>
                    </div>

                    <div className="mt-12 pt-6 border-t border-gray-200 dark:border-neutral-700">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Still need help?</p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 font-medium transition-colors duration-300 dark:text-green-500 dark:hover:text-green-400"
                        >
                            <Mail className="text-lg" />
                            Contact Support
                        </Link>
                    </div>
                </div>

                <div className="bg-green-50 dark:bg-neutral-700 p-4 text-center">
                    <p className="text-sm text-green-800 dark:text-green-200">
                        © {new Date().getFullYear()} Ecco_Web Marketplace. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    )
}