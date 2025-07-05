import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  HelpCircle,
  Mail,
  BookOpen,
  DollarSign,
  TrendingUp,
  PieChart,
  Shield,
  CreditCard,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Lightbulb,
  Target,
  Calculator,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const HelpCenterPage = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      category: "Getting Started",
      icon: BookOpen,
      color: "bg-blue-100 text-blue-700",
      questions: [
        {
          q: "How do I set up my budget categories?",
          a: "Navigate to the Dashboard  from the sidebar. Click on 'Add Category' and enter your category name, monthly limit, and choose an icon. You can create categories like Food, Transport, Entertainment, etc.",
        },
        {
          q: "How do I track my first expense?",
          a: "Go to the Expenses page and click 'Add Expense'. Fill in the amount, select a category, choose payment method, and add a description. Your expense will be automatically tracked against your budget.",
        },
      ],
    },
    {
      id: 2,
      category: "Budget Management",
      icon: Target,
      color: "bg-green-100 text-green-700",
      questions: [
        {
          q: "What happens when I exceed my budget?",
          a: "You'll receive an alert on your dashboard when you reach 85% of your budget. If you exceed it, the category will show in red with an 'exceeded' status. You can still add expenses but should consider adjusting your spending.",
        },
        {
          q: "Can I modify budget limits mid-month?",
          a: "Yes! Go to the Budget page, click on any category, and select 'Edit'. You can adjust the limit anytime. The system will recalculate your usage percentage based on the new limit.",
        },
      ],
    },
    {
      id: 3,
      category: "Expense Tracking",
      icon: DollarSign,
      color: "bg-purple-100 text-purple-700",
      questions: [
        {
          q: "What payment methods can I track?",
          a: "You can track expenses made via Credit Card, Debit Card, UPI, Cash, and Net Banking. Each payment method is tracked separately in your reports.",
        },
        {
          q: "Can I edit or delete past expenses?",
          a: "Yes, navigate to the Expenses page, find the expense you want to modify, and click the edit or delete icon. Note that this will update your budget calculations.",
        },
      ],
    },
    {
      id: 4,
      category: "Reports & Analytics",
      icon: PieChart,
      color: "bg-orange-100 text-orange-700",
      questions: [
        {
          q: "How do I generate monthly reports?",
          a: "Go to the Reports section and select the time period (1, 3, or 6 months). The system will generate detailed breakdowns of your spending by category and payment method.",
        },
        {
          q: "What insights can I get from reports?",
          a: "Reports show your top spending categories, payment method preferences, month-over-month trends, and categories where you've exceeded budget. Use these insights to optimize your spending.",
        },
      ],
    },
  ];

  const quickTips = [
    {
      icon: Lightbulb,
      title: "Set Realistic Budgets",
      description: "Start with your average spending and adjust gradually",
    },
    {
      icon: Calculator,
      title: "Track Daily",
      description: "Log expenses immediately to maintain accuracy",
    },
    {
      icon: FileText,
      title: "Review Weekly",
      description: "Check your budget status every week to stay on track",
    },
    {
      icon: AlertCircle,
      title: "Act on Alerts",
      description: "Respond to budget warnings to avoid overspending",
    },
  ];

  const toggleFaq = (categoryId, questionIndex) => {
    const key = `${categoryId}-${questionIndex}`;
    setExpandedFaq(expandedFaq === key ? null : key);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="absolute top-0 left-0 w-96 h-96 opacity-5">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#1F2937"
            d="M47.7,-61.3C61.3,-52.5,71.5,-37.2,75.8,-20.2C80.1,-3.2,78.5,15.5,71.4,31.3C64.3,47.1,51.7,60,36.6,66.7C21.5,73.4,3.9,73.9,-13.5,70.4C-30.9,66.9,-48.1,59.4,-59.6,47.1C-71.1,34.8,-76.9,17.7,-76.6,0.2C-76.3,-17.3,-69.9,-35,-58.4,-48.3C-46.9,-61.6,-30.3,-70.5,-13.4,-71.4C3.5,-72.3,34.1,-70.1,47.7,-61.3Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-gray-700" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
        </div>
        <p className="text-gray-600">
          Find answers to common questions and learn how to make the most of
          your financial tracker
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickTips.map((tip, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <tip.icon className="w-5 h-5 text-yellow-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {tip.title}
                </h3>
                <p className="text-sm text-gray-600">{tip.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faqs.map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * category.id }}
                  className="border rounded-xl overflow-hidden"
                >
                  <div className="p-4 bg-gray-50 flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}
                    >
                      <category.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {category.category}
                    </h3>
                  </div>

                  <div className="divide-y">
                    {category.questions.map((item, qIndex) => (
                      <div key={qIndex} className="p-4">
                        <button
                          onClick={() => toggleFaq(category.id, qIndex)}
                          className="w-full flex items-center justify-between text-left hover:text-gray-700 transition-colors"
                        >
                          <span className="font-medium text-gray-900 pr-4">
                            {item.q}
                          </span>
                          {expandedFaq === `${category.id}-${qIndex}` ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>

                        {expandedFaq === `${category.id}-${qIndex}` && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3"
                          >
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {item.a}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-700" />
              </div>
              <h3 className="font-semibold text-gray-900">Data Security</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Your financial data is encrypted and stored securely. We never
              share your information with third parties.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>256-bit encryption</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Secure cloud storage</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Regular backups</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
              <div className="w-full h-full bg-white rounded-full opacity-10"></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">Need More Help?</h3>
              </div>

              <p className="text-sm text-gray-300 mb-4">
                Can't find what you're looking for? Our support team is here to
                help you.
              </p>

              <a
                href="mailto:devsingh2017dp@gmail.com"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Contact Support
              </a>

              <p className="text-xs text-gray-400 mt-4">
                devsingh2017dp@gmail.com
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-3">
              <Link
                to="/dashboard/report"
                className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">View spending trends</span>
              </Link>
              <Link
                to="/dashboard/report"
                className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-sm">Manage payment methods</span>
              </Link>
              <Link
                to="/dashboard/report"
                className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <PieChart className="w-4 h-4" />
                <span className="text-sm">Generate reports</span>
              </Link>
              <Link
                to="/dashboard/"
                className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Target className="w-4 h-4" />
                <span className="text-sm">Set budget goals</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
