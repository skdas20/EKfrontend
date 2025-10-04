import { ShoppingCart, User, LogOut, MapPin, Package, X, Home, HelpCircle, Smartphone } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useLocation } from '../../context/LocationContext'
import CartDrawer from '../Cart/CartDrawer'
import LoginModal from '../Auth/LoginModal'
import PincodeModal from '../Location/PincodeModal'
import OrderHistory from '../Orders/OrderHistory'
import SearchBar from '../Search/SearchBar'

/* ===========================================
   EasyKirana SVG Logo for Header (with shine)
   - Same basket + gradients + word-mark
   - Occasional shine sweep across the text
   - Scales to header height (h-10)
   =========================================== */
const EKLogo = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`relative ${className}`} aria-hidden="false" aria-label="EasyKirana logo">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Montserrat:wght@400;600&display=swap');

        /* Shine sweep every ~7.5s, brief and subtle */
        @keyframes ekShine {
          0%   { transform: translateX(-120%); opacity: 0; }
          8%   { opacity: .0; }
          12%  { opacity: .25; }
          18%  { opacity: .18; }
          24%  { opacity: 0; transform: translateX(140%); }
          100% { opacity: 0; transform: translateX(140%); }
        }
        .ek-shine {
          position: absolute;
          inset: 0;
          pointer-events: none;
          mix-blend-mode: screen; /* gentle highlight effect */
          will-change: transform, opacity;
          animation: ekShine 7.5s ease-in-out infinite;
        }
        /* diagonal soft gradient strip */
        .ek-shine::before {
          content: '';
          position: absolute;
          top: -30%;
          bottom: -30%;
          left: 0;
          width: 45%;
          transform: skewX(-18deg);
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.65) 50%, rgba(255,255,255,0) 100%);
          border-radius: 12px;
        }
        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .ek-shine { animation: none; display: none; }
        }
      `}</style>

      <svg
        viewBox="0 0 1200 420"
        role="img"
        aria-label="EasyKirana — Grocery Became Easy"
        className="h-full w-auto"
      >
        <defs>
          <linearGradient id="g-easy" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1CB64E" />
            <stop offset="100%" stopColor="#0D8F2F" />
          </linearGradient>
          <linearGradient id="g-kirana" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFA22A" />
            <stop offset="60%" stopColor="#FF7F1E" />
            <stop offset="100%" stopColor="#EB5C0C" />
          </linearGradient>
          <linearGradient id="g-basket" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFA33A" />
            <stop offset="100%" stopColor="#FF7F1E" />
          </linearGradient>
          <linearGradient id="g-carrot" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFA63E" />
            <stop offset="100%" stopColor="#FF7B1B" />
          </linearGradient>
        </defs>

        {/* Basket group */}
        <g transform="translate(90,120)">
          {/* handle */}
          <path d="M40 70 L60 10 H150 L170 70" fill="none" stroke="#18A145" strokeWidth="12" strokeLinecap="round" />
          <rect x="80" y="0" rx="14" ry="14" width="50" height="26" fill="#FFFFFF" stroke="#18A145" strokeWidth="10" />

          {/* items */}
          <path d="M72 90 l24 -12 l24 12 v48 h-48z" fill="#FDE2F4" stroke="#E91E63" strokeWidth="3" />
          <rect x="84" y="80" width="24" height="10" fill="#FF6BAA" opacity="0.9" />

          <ellipse cx="155" cy="92" rx="24" ry="8" fill="#89E1DB" />
          <rect x="131" y="92" width="48" height="36" fill="#A7F3D0" />
          <ellipse cx="155" cy="128" rx="24" ry="8" fill="#7ED4C8" />
          <rect x="133" y="80" width="44" height="10" fill="#23B3A9" rx="4" />

          {/* carrot */}
          <path
            d="M210 65 C240 60 260 72 270 90 C276 102 274 116 264 122 C236 139 203 95 210 65 Z"
            fill="url(#g-carrot)" stroke="#E66410" strokeWidth="2.5"
          />
          <path d="M228 54 C238 39 255 42 264 44" fill="none" stroke="#25B34D" strokeWidth="6" strokeLinecap="round" />
          <path d="M220 52 C225 36 238 34 246 35" fill="none" stroke="#31C25A" strokeWidth="6" strokeLinecap="round" />

          {/* basket body */}
          <rect x="0" y="110" width="320" height="180" rx="16" fill="url(#g-basket)" stroke="#18A145" strokeWidth="14" />
          <rect x="-10" y="110" width="340" height="30" rx="14" fill="#FF8D23" stroke="#18A145" strokeWidth="10" />

          {/* basket grid */}
          <g stroke="#18A145" strokeWidth="7" opacity="0.9">
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`v${i}`} x1={20 + i * 28} y1={148} x2={20 + i * 28} y2={280} />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={`h${i}`} x1={14} y1={160 + i * 24} x2={306} y2={160 + i * 24} />
            ))}
          </g>
        </g>

        {/* Word-mark */}
        <text x="450" y="245" fontFamily="'Pacifico', cursive" fontSize="124" fill="url(#g-easy)" stroke="#0A8E2C" strokeWidth="2" style={{ paintOrder: 'stroke' }}>
          Easy
        </text>
        <rect x="470" y="260" width="160" height="6" rx="3" fill="#1CB64E" />
        <text x="690" y="245" fontFamily="'Pacifico', cursive" fontSize="124" fill="url(#g-kirana)" stroke="#D9540A" strokeWidth="2" style={{ paintOrder: 'stroke' }}>
          Kirana
        </text>

        {/* Tagline (kept lower so it never collides) */}
        <text x="520" y="340" fontFamily="'Montserrat', sans-serif" fontSize="26" letterSpacing="8" fill="#18A145">
          Grocery Became Easy
        </text>
      </svg>

      {/* Shine strip overlay (moves across occasionally) */}
      <span className="ek-shine" />
    </div>
  )
}

export default function Header() {
  // mobile menu removed for single-page site
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isPincodeOpen, setIsPincodeOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showOrderHistory, setShowOrderHistory] = useState(false)
  const navigate = useNavigate()
  const { state } = useCart()
  const { user, logout, isLoginModalOpen, showLoginModal, hideLoginModal } = useAuth()
  const { pincode } = useLocation()
  const userMenuCloseTimeout = useRef<number | null>(null)
  const userMenuWrapperRef = useRef<HTMLDivElement | null>(null)
  const userMenuDropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const openCartListener = (e: Event) => {
      const detail = (e as CustomEvent)?.detail || {}
      setIsCartOpen(true)
      if (detail.openCheckout) {
        window.setTimeout(() => window.dispatchEvent(new CustomEvent('openCart', { detail })), 50)
      }
    }

    const showOrderHistoryListener = () => {
      setShowOrderHistory(true)
    }

    window.addEventListener('openCart', openCartListener as EventListener)
    window.addEventListener('showOrderHistory', showOrderHistoryListener as EventListener)

    return () => {
      window.removeEventListener('openCart', openCartListener as EventListener)
      window.removeEventListener('showOrderHistory', showOrderHistoryListener as EventListener)
    }
  }, [])

  // Auto-open OrderHistory if URL has ?view=orders (from email track links)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('view') === 'orders' && user) {
      setShowOrderHistory(true)
      // Clean up URL without page reload
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [user])

  useEffect(() => {
    if (!showUserMenu) return
    const onPointerMove = (e: PointerEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (!el) return
      if (userMenuWrapperRef.current?.contains(el) || userMenuDropdownRef.current?.contains(el)) {
        if (userMenuCloseTimeout.current) {
          window.clearTimeout(userMenuCloseTimeout.current)
          userMenuCloseTimeout.current = null
        }
        return
      }
      if (userMenuCloseTimeout.current) window.clearTimeout(userMenuCloseTimeout.current)
      userMenuCloseTimeout.current = window.setTimeout(() => {
        setShowUserMenu(false)
        userMenuCloseTimeout.current = null
      }, 200)
    }
    const onPointerDown = (ev: PointerEvent) => {
      const el = ev.target as Node | null
      if (!el) return
      if (userMenuWrapperRef.current?.contains(el) || userMenuDropdownRef.current?.contains(el)) return
      setShowUserMenu(false)
    }
    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerdown', onPointerDown)
      if (userMenuCloseTimeout.current) {
        window.clearTimeout(userMenuCloseTimeout.current)
        userMenuCloseTimeout.current = null
      }
    }
  }, [showUserMenu])

  // Prevent body scroll when smaller modals are open (but allow full-page Order History to scroll)
  useEffect(() => {
    // We want the Order History to behave like a full page — allow body scroll.
    if (isPincodeOpen || isLoginModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isPincodeOpen, isLoginModalOpen])

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Location */}
          <div className="flex items-center space-x-4 h-10">
            <a href="/" aria-label="EasyKirana home" className="inline-flex items-center h-10">
              {/* SVG logo scaled to header height */}
              <EKLogo className="h-10 w-auto" />
            </a>

            {pincode && (
              <button
                onClick={() => setIsPincodeOpen(true)}
                className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-brand-600 transition-colors h-8"
              >
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">{pincode}</span>
              </button>
            )}
          </div>

          {/* Search Bar - Desktop */}
          <div className="flex-1 max-w-lg mx-8 hidden md:flex items-center">
            <SearchBar className="w-full" />
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4 h-10">
            {user ? (
              <div
                className="relative"
                ref={(el) => { userMenuWrapperRef.current = el }}
                onMouseEnter={() => {
                  if (userMenuCloseTimeout.current) {
                    window.clearTimeout(userMenuCloseTimeout.current)
                    userMenuCloseTimeout.current = null
                  }
                  setShowUserMenu(true)
                }}
                onMouseLeave={(e) => {
                  const related = (e as React.MouseEvent).relatedTarget as Node | null
                  if (related && (userMenuWrapperRef.current?.contains(related) || userMenuDropdownRef.current?.contains(related))) {
                    return
                  }
                  if (userMenuCloseTimeout.current) window.clearTimeout(userMenuCloseTimeout.current)
                  userMenuCloseTimeout.current = window.setTimeout(() => {
                    setShowUserMenu(false)
                    userMenuCloseTimeout.current = null
                  }, 250)
                }}
              >
                <button
                  className="inline-flex items-center gap-2 text-gray-700 hover:text-brand-600 h-8"
                  onClick={() => {
                    if (userMenuCloseTimeout.current) {
                      window.clearTimeout(userMenuCloseTimeout.current)
                      userMenuCloseTimeout.current = null
                    }
                    setShowUserMenu((s) => !s)
                  }}
                  aria-haspopup="true"
                  aria-expanded={showUserMenu}
                >
                  <User className="h-6 w-6" />
                </button>

                {showUserMenu && (
                  <div
                    ref={(el) => { userMenuDropdownRef.current = el }}
                    className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl z-50 border border-gray-100 overflow-hidden"
                    onMouseEnter={() => {
                      if (userMenuCloseTimeout.current) {
                        window.clearTimeout(userMenuCloseTimeout.current)
                        userMenuCloseTimeout.current = null
                      }
                    }}
                    onMouseLeave={(e) => {
                      const related = (e as React.MouseEvent).relatedTarget as Node | null
                      if (related && (userMenuWrapperRef.current?.contains(related) || userMenuDropdownRef.current?.contains(related))) {
                        return
                      }
                      if (userMenuCloseTimeout.current) window.clearTimeout(userMenuCloseTimeout.current)
                      userMenuCloseTimeout.current = window.setTimeout(() => {
                        setShowUserMenu(false)
                        userMenuCloseTimeout.current = null
                      }, 250)
                    }}
                  >
                    {/* User Info Header */}
                    <div className="px-4 py-4 bg-gradient-to-r from-brand-50 to-cream-50 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-brand-gradient rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.name || user.phone}</p>
                          <p className="text-sm text-gray-600">{user.name ? user.phone : user.role}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowOrderHistory(true)
                          setShowUserMenu(false)
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Package className="h-5 w-5 mr-3 text-brand-600" />
                        <div className="text-left">
                          <div className="font-medium">My Orders</div>
                          <div className="text-xs text-gray-500">Track your orders</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          navigate('/addresses')
                          setShowUserMenu(false)
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Home className="h-5 w-5 mr-3 text-brand-600" />
                        <div className="text-left">
                          <div className="font-medium">Saved Addresses</div>
                          <div className="text-xs text-gray-500">Manage delivery addresses</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          // TODO: Implement FAQ modal or page
                          console.log('Open FAQ')
                          setShowUserMenu(false)
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <HelpCircle className="h-5 w-5 mr-3 text-brand-600" />
                        <div className="text-left">
                          <div className="font-medium">FAQ</div>
                          <div className="text-xs text-gray-500">Get help & support</div>
                        </div>
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100"></div>

                    {/* App Download Section */}
                    <div className="px-4 py-4 bg-gray-50">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-3">
                          <Smartphone className="h-4 w-4 text-brand-600" />
                          <span className="text-sm font-medium text-gray-700">Download Our App</span>
                        </div>

                        {/* QR Code - Using a placeholder for now */}
                        <div className="w-20 h-20 mx-auto mb-3 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
                          <svg
                            width="60"
                            height="60"
                            viewBox="0 0 100 100"
                            className="text-gray-800"
                          >
                            {/* Simple QR-like pattern */}
                            <rect x="10" y="10" width="20" height="20" fill="currentColor" />
                            <rect x="70" y="10" width="20" height="20" fill="currentColor" />
                            <rect x="10" y="70" width="20" height="20" fill="currentColor" />
                            <rect x="40" y="40" width="20" height="20" fill="currentColor" />

                            {/* Small squares pattern */}
                            <rect x="15" y="15" width="10" height="10" fill="white" />
                            <rect x="75" y="15" width="10" height="10" fill="white" />
                            <rect x="15" y="75" width="10" height="10" fill="white" />
                            <rect x="45" y="45" width="10" height="10" fill="white" />

                            {/* Data pattern */}
                            <rect x="50" y="10" width="5" height="5" fill="currentColor" />
                            <rect x="60" y="10" width="5" height="5" fill="currentColor" />
                            <rect x="50" y="20" width="5" height="5" fill="currentColor" />
                            <rect x="35" y="25" width="5" height="5" fill="currentColor" />
                            <rect x="40" y="30" width="5" height="5" fill="currentColor" />
                            <rect x="65" y="35" width="5" height="5" fill="currentColor" />
                            <rect x="70" y="40" width="5" height="5" fill="currentColor" />
                            <rect x="80" y="50" width="5" height="5" fill="currentColor" />
                            <rect x="35" y="55" width="5" height="5" fill="currentColor" />
                            <rect x="50" y="65" width="5" height="5" fill="currentColor" />
                            <rect x="80" y="70" width="5" height="5" fill="currentColor" />
                            <rect x="45" y="80" width="5" height="5" fill="currentColor" />
                          </svg>
                        </div>

                        <p className="text-xs text-gray-600">Scan to download EasyKirana app</p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100"></div>

                    {/* Sign Out */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          logout()
                          setShowUserMenu(false)
                          window.location.reload()
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        <div className="font-medium">Sign out</div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => showLoginModal()}
                className="inline-flex items-center gap-1 text-gray-700 hover:text-brand-600 h-8"
              >
                <User className="h-6 w-6" />
                <span className="hidden sm:inline text-sm font-medium leading-none">Login</span>
              </button>
            )}

            <button
              className="relative inline-flex items-center text-gray-700 hover:text-brand-600 h-8"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-6 w-6" />
              {state.itemCount > 0 && (
                <>
                  <span className="absolute -top-2 -right-2 bg-brand-gradient text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {state.itemCount}
                  </span>
                  <span className="absolute -bottom-3 -right-4 bg-green-600 text-white rounded text-xs px-1.5 py-0.5 text-[10px] leading-none font-medium shadow-md">
                    ₹{Number(state.total || 0).toFixed(0)}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden py-3">
          <SearchBar className="w-full" />
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => hideLoginModal()}
      />
      <PincodeModal
        isOpen={isPincodeOpen}
        onClose={() => setIsPincodeOpen(false)}
        isFirstTime={false}
      />

      {/* Order History — render as a full page so it can scroll naturally */}
      {showOrderHistory && (
        <div className="fixed inset-0 z-50 bg-white overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between sticky top-0 bg-white z-20 py-3 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">My Orders</h2>
              <button
                onClick={() => setShowOrderHistory(false)}
                className="text-gray-400 hover:text-gray-600 p-2"
                aria-label="Close order history"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-4">
              <OrderHistory onClose={() => setShowOrderHistory(false)} />
            </div>
          </div>
        </div>
      )}

    </header>
  )
}
