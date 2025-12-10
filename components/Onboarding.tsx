'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, Sparkles, Coins, ArrowRight } from 'lucide-react'

interface OnboardingProps {
    onComplete: () => void
}

const steps = [
    {
        icon: Rocket,
        title: 'Welcome to BaseCreator',
        description: 'Create and launch meme tokens on Base blockchain with ease',
        color: 'from-purple-500 to-pink-500',
    },
    {
        icon: Sparkles,
        title: 'Custom Design',
        description: 'Unique logos and banners automatically generated for your token',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        icon: Coins,
        title: 'Deploy Instantly',
        description: 'Launch your token for just 0.01 ETH on Base',
        color: 'from-green-500 to-emerald-500',
    },
]

export default function Onboarding({ onComplete }: OnboardingProps) {
    const [currentStep, setCurrentStep] = useState(0)

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            onComplete()
        }
    }

    const currentStepData = steps[currentStep]
    const Icon = currentStepData.icon

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700"
                    >
                        <div className="flex justify-center mb-6">
                            <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${currentStepData.color} flex items-center justify-center`}>
                                <Icon className="w-10 h-10 text-white" />
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white mb-3">
                                {currentStepData.title}
                            </h2>
                            <p className="text-gray-300">{currentStepData.description}</p>
                        </div>

                        <div className="flex justify-center gap-2 mb-6">
                            {steps.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-all ${index === currentStep ? 'bg-purple-500 w-8' : 'bg-gray-600'
                                        }`}
                                />
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={onComplete}
                                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                            >
                                Skip
                            </button>
                            <button
                                onClick={handleNext}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg flex items-center justify-center gap-2 font-semibold"
                            >
                                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
