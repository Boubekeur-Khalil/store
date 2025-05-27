import Link from "next/link";
import { FaTwitter, FaFacebookF, FaInstagram } from "react-icons/fa";
import { FooterConstants } from "@/utils/constants";

export default function Footer() {
  const { 
    companyName, 
    companyDescription, 
    socialLinks, 
    companyLinks, 
    helpLinks, 
    faqLinks, 
    resourceLinks, 
    paymentMethods,
    copyright 
  } = FooterConstants;

  return (
    <footer className="bg-gray-50 text-gray-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-[100px]">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-gray-900">{companyName}</h4>
            <p className="text-sm">{companyDescription}</p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a key={link.name} href={link.url} className="text-gray-500 hover:text-gray-900">
                  {link.name === "Twitter" && <FaTwitter className="w-5 h-5" />}
                  {link.name === "Facebook" && <FaFacebookF className="w-5 h-5" />}
                  {link.name === "Instagram" && <FaInstagram className="w-5 h-5" />}
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">COMPANY</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.url} className="text-sm hover:text-gray-900">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">HELP</h4>
            <ul className="space-y-2">
              {helpLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.url} className="text-sm hover:text-gray-900">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">FAQ</h4>
            <ul className="space-y-2">
              {faqLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.url} className="text-sm hover:text-gray-900">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">RESOURCES</h4>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.url} className="text-sm hover:text-gray-900">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">{copyright}</p>
          </div>
          <div className="flex space-x-4">
            {paymentMethods.map((method) => (
              <img 
                key={method.name}
                src={method.icon} 
                alt={method.name} 
                className="w-8 h-8 object-contain"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}