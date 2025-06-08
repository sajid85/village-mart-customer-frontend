export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">About Village Mart</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Welcome to Village Mart, your local online marketplace connecting you with fresh, quality products from our community.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Our Story & Mission</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Village Mart was founded with the vision of bringing the convenience of online shopping together with the charm and quality of local markets. We aim to support local farmers, producers, and businesses by providing a platform to reach customers directly.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our mission is to make fresh, locally sourced products easily accessible to everyone, fostering a stronger community and promoting sustainable practices.
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-8 border border-green-200">
          <h3 className="text-2xl font-bold mb-4 text-green-800">Our Commitment</h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-green-600 mr-3 text-xl">✓</span>
              <div>
                <strong className="block text-gray-800">Support Local</strong>
                <span className="text-gray-700">Connecting you directly with local producers</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-3 text-xl">✓</span>
              <div>
                <strong className="block text-gray-800">Freshness & Quality</strong>
                <span className="text-gray-700">Ensuring the highest quality local products</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-3 text-xl">✓</span>
              <div>
                <strong className="block text-gray-800">Community Focused</strong>
                <span className="text-gray-700">Building a stronger, connected community</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-3 text-xl">✓</span>
              <div>
                <strong className="block text-gray-800">Convenient Shopping</strong>
                <span className="text-gray-700">Easy and accessible online marketplace</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* How it Works Section (New Section) */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">How Village Mart Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="text-green-600 mb-4">
              {/* Icon Placeholder 1 */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.264 1.263c1.107 1.107 1.107 2.893 0 4l-1.264 1.265a1.5 1.5 0 01-2.122 0l-.224-.224m-1.264-1.264l1.264 1.264c1.107 1.107 1.107 2.893 0 4l-1.264 1.265a1.5 1.5 0 01-2.122 0l-.224-.224M9 12v6a3 3 0 003 3h.257a3 3 0 002.659-1.39l1.511-2.267a1.5 1.5 0 00-2.122-2.122l-.224.224mu00200u0020.224-.224m5.657-5.657l-1.264 1.264a1.5 1.5 0 002.122 2.122l.224-.224m0 0l.224-.224a1.5 1.5 0 000-2.122l-1.264-1.264zm-5.657 5.657l-1.264 1.264a1.5 1.5 0 002.122 2.122l.224-.224m0 0l.224-.224a1.5 1.5 0 000-2.122l-1.264-1.264z"
                      />
                    </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Browse Local Products</h3>
            <p className="text-gray-700">Discover a wide variety of fresh produce, artisanal goods, and more from local vendors in your area.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="text-green-600 mb-4">
              {/* Icon Placeholder 2 */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.104c1.452.232 2.91-.384 3.428-1.624A7.149 7.149 0 0021.75 14.25V13.5a3 3 0 00-3-3h-.096c-.733 0-1.45-.304-1.96-.834l-2.16-2.161A6.421 6.421 0 0012.75 7.5h-1.218a9.315 9.315 0 014.052-1.36c1.336-.317 2.567-1.28 2.808-2.534a1.516 1.516 0 00-1.403-1.742M4.5 18.75l0-.869a8.643 8.643 0 002.928 6.4m-2.928-6.4A9.315 9.315 0 008.818 19.5H12.75m4.726-5.61a.905.905 0 011.352-.91m5.657.91a.905.905 0 011.352-.91M4.5 18.75h1.014c.412 0 .816.015 1.217.043 1.93-.557 3.88-1.352 5.83-2.147m6.182 2.147a9.315 9.315 0 00-5.83-2.147M12.75 13.5v3.039m.426 3.153l-.5.5m.5-.5H15m-2.49-2.49a.905.905 0 01.91-.91h.75a.905.905 0 01.91.91m-3.852 0a.905.905 0 01.91-.91h.75a.905.905 0 01.91.91"
                      />
                    </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Place Your Order</h3>
            <p className="text-gray-700">Add items to your cart and enjoy a simple and secure checkout process.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="text-green-600 mb-4">
              {/* Icon Placeholder 3 */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3M10.5 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9 0h9m3 0h9m-9 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9 0h9m3 0h9m-9 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9 0h9m3 0h9M3 12h18M12 3c1.359 0 2.694.06 4 .195V12m6.824-9.946A4.48 4.48 0 0118 1.942v2.276a3.342 3.342 0 001.658 2.254l.047.028a2.273 2.273 0 01.636 1.8V12a9 9 0 00-9 9.75A15.988 15.988 0 003 12V6.276a2.273 2.273 0 01.636-1.8l.049-.028A3.342 3.342 0 006 3.942V1.942c1.309 0 2.599.035 3.897.107a4.48 4.48 0 014.052 4.052L14.25 8.25zM3 12a9 9 0 019-9.75c1.309 0 2.599.035 3.898.107l-.442 1.484a4.48 4.48 0 00-4.052-4.052A15.988 15.988 0 003 12z"
                      />
                    </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Fast Local Delivery</h3>
            <p className="text-gray-700">Get your fresh products delivered quickly and reliably right to your doorstep from local sources.</p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-green-50 rounded-lg p-8 text-center border border-green-200">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Get in Touch</h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Have questions or feedback? We'd love to hear from you. Reach out to us and we'll connect you with our local support team.
        </p>
        <button className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition-colors duration-300 font-semibold">
          Contact Us
        </button>
      </div>
    </div>
  );
} 