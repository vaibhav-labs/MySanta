import Link from "next/link"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white text-ink">

      {/* Nav */}
      <nav className="border-b border-secondary bg-white sticky top-0 z-50">
        <div className="container h-14 flex items-center justify-between">
          <Link href="/">
            <span className="font-display text-2xl uppercase text-ink tracking-wider">MySanta</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs font-semibold uppercase tracking-widest text-gray-500 hover:text-ink transition-colors hidden md:block">
              Home
            </Link>
            <Link href="/sign-in">
              <button className="bg-brand text-ink text-xs font-bold uppercase tracking-widest px-5 py-2.5 hover:bg-brand-dark transition-colors">
                Get Started Free
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="border-b border-secondary">
        <div className="container py-16">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Complete walkthrough</p>
          <h1 className="font-display text-[clamp(3.5rem,9vw,8rem)] uppercase leading-none text-ink mb-6">
            How it<br />
            <span className="bg-brand px-2">works.</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl leading-relaxed">
            From zero to a shared wishlist in under 3 minutes. Here's everything you can do on MySanta — no sign-up needed to read this.
          </p>
        </div>
      </section>

      {/* ── STEP 1: Create account ── */}
      <Step
        number="01"
        title="Create your free account"
        description="Sign up with Google in one click, or use email. We only ask for the basics — name, email, date of birth. No credit card, no subscription, no catch."
        side="right"
        visual={<SignUpMockup />}
      />

      {/* ── STEP 2: Create a wishlist ── */}
      <Step
        number="02"
        title="Create a wishlist"
        description="Give your list a name and tie it to an event — birthday, wedding, Diwali, or just 'random wants'. Each list gets its own shareable link."
        side="left"
        visual={<CreateListMockup />}
      />

      {/* ── STEP 3: Add items via URL ── */}
      <Step
        number="03"
        title="Add items from any website"
        description="Paste a product URL from Amazon, Flipkart, Myntra, Nike, or anywhere. Our auto-fill pulls the product name, price, and image automatically. You can also fill it in manually."
        side="right"
        visual={<AddItemMockup />}
      />

      {/* ── STEP 4: Share the link ── */}
      <Step
        number="04"
        title="Share one link with everyone"
        description="Copy your list's unique link and send it to your squad. They can view it without signing up. Every list has its own public URL at mysanta.fun/lists/..."
        side="left"
        visual={<ShareMockup />}
      />

      {/* ── STEP 5: Friends hold items ── */}
      <Step
        number="05"
        title="Friends hold items — no duplicates"
        description="When a friend wants to buy something, they 'hold' it. Other people see it's taken and pick something else. This prevents the awkward 'oh, I got you that too' situation."
        side="right"
        visual={<HoldMockup />}
      />

      {/* ── STEP 6: Purchase flow ── */}
      <Step
        number="06"
        title="Buy, then mark as purchased"
        description="Friends click 'View Product' to go to the actual store and buy it. Once they've ordered, they mark it as 'Purchased' in MySanta. The item is removed from the available list."
        side="left"
        visual={<PurchaseMockup />}
      />

      {/* ── STEP 7: Save to my list ── */}
      <Step
        number="07"
        title="Spot something? Save it to your own list."
        description="While browsing a friend's list and you see something you love? Hit 'Save to my list' — it copies the product to one of your own wishlists instantly. No re-adding manually."
        side="right"
        visual={<SaveToListMockup />}
      />

      {/* ── STEP 8: Chip in together ── */}
      <Step
        number="08"
        title="Chip in with friends on expensive gifts"
        description="For big-ticket items, multiple friends can 'Join Collaboration' instead of one person buying alone. Everyone splits the cost. The item shows as 'Held by a group' so others know it's covered."
        side="left"
        visual={<ChipInMockup />}
      />

      {/* ── STEP 9: Owner view ── */}
      <Step
        number="09"
        title="You only see what you're allowed to"
        description="When you view your own list, you see everything — including what's been purchased. When friends view it, purchased items are hidden so your surprises stay surprises."
        side="right"
        visual={<OwnerViewMockup />}
      />

      {/* ── Feature highlights grid ── */}
      <section className="border-t border-b border-secondary bg-ink text-white">
        <div className="container">
          <div className="py-10 border-b border-white/10">
            <h2 className="font-display text-5xl md:text-7xl uppercase">More features.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Events',
                desc: 'Create an event (birthday, wedding, etc.) and an auto-linked gift list is created instantly. Events show up on your dashboard with a countdown.',
                icon: '📅',
              },
              {
                title: 'Friends',
                desc: 'Add friends by email. Once connected, you can see each other\'s public lists and wishlists. Friend requests, accepts, and a mutual feed.',
                icon: '👯',
              },
              {
                title: 'Dashboard',
                desc: 'Your home base — upcoming events, recent lists, gifts sent vs received stats. Everything in one place.',
                icon: '📊',
              },
              {
                title: 'Public list sharing',
                desc: 'Anyone with your link can view your list — they don\'t need a MySanta account. They only need to sign up if they want to hold or purchase an item.',
                icon: '🔗',
              },
              {
                title: 'Multiple currencies',
                desc: 'Items auto-detect currency from the product URL. INR, USD, EUR, GBP and more — we display the price correctly wherever it came from.',
                icon: '💰',
              },
              {
                title: 'Chip in together',
                desc: 'For expensive gifts, friends can join a collaboration and split the cost. The item shows as "held by a group" so others know it\'s covered.',
                icon: '🤝',
              },
              {
                title: 'Save to my list',
                desc: 'Spot something amazing on a friend\'s list? Save it to one of your own wishlists instantly. One click, no re-adding.',
                icon: '📌',
              },
              {
                title: 'Notifications',
                desc: 'Get notified when a friend holds or purchases an item from your list — without knowing what it is. The suspense is half the fun.',
                icon: '🔔',
              },
            ].map((f, i) => (
              <div key={f.title} className={`p-8 border-white/10 ${i % 3 !== 2 ? 'border-r' : ''} ${i < 3 ? 'border-b' : ''}`}>
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-display text-2xl uppercase text-white mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-b border-secondary">
        <div className="container">
          <div className="py-10 border-b border-secondary">
            <h2 className="font-display text-5xl md:text-6xl uppercase">All your questions. Here.</h2>
          </div>
          <div className="divide-y divide-secondary">
            {[
              { q: 'Do my friends need an account to view my list?', a: 'No. Anyone with your list link can view it. They only need to sign up if they want to hold or purchase an item.' },
              { q: 'Can I add items from any website?', a: 'Yes. Paste any product URL and we\'ll auto-fill the details. It works best on major e-commerce sites (Amazon, Flipkart, Myntra, etc.). For other sites you can fill in the details manually.' },
              { q: 'How do I prevent duplicate gifts?', a: 'When a friend clicks "Hold this gift", it shows as reserved to everyone else. They\'ll see it\'s taken and can choose something else instead.' },
              { q: 'Will I know who\'s buying what?', a: 'No — and that\'s by design. You\'ll be notified when something is purchased but not who bought it or what it was. Surprises stay surprises.' },
              { q: 'Is it free?', a: 'Yes, completely free for personal use. Create as many lists as you want, add as many items as you need, invite unlimited friends.' },
              { q: 'Can I use MySanta in India?', a: 'Absolutely. We support Indian rupees (INR), work with all major Indian e-commerce sites, and have occasion types like Diwali and Holi built in.' },
            ].map(({ q, a }) => (
              <div key={q} className="py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <p className="font-semibold text-ink">{q}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-brand border-b border-ink/10">
        <div className="container py-20">
          <h2 className="font-display text-[clamp(3rem,8vw,7rem)] uppercase text-ink leading-none mb-8">
            Ready? It takes<br />2 minutes.
          </h2>
          <Link href="/sign-in">
            <button className="bg-ink text-white text-sm font-bold uppercase tracking-widest px-10 py-4 hover:bg-gray-800 transition-colors">
              Create my wishlist — free →
            </button>
          </Link>
        </div>
      </section>

      {/* Footer strip */}
      <div className="bg-ink py-5">
        <div className="container flex items-center justify-between">
          <span className="font-display text-2xl uppercase text-white tracking-wider">MySanta</span>
          <Link href="/" className="text-white/30 text-xs font-semibold uppercase tracking-widest hover:text-white transition-colors">← Back to home</Link>
        </div>
      </div>
    </div>
  )
}

/* ── Step layout component ── */
function Step({ number, title, description, visual, side }: {
  number: string
  title: string
  description: string
  visual: React.ReactNode
  side: 'left' | 'right'
}) {
  return (
    <section className="border-b border-secondary">
      <div className="container">
        <div className={`grid grid-cols-1 lg:grid-cols-2 min-h-[480px] ${side === 'left' ? 'lg:flex-row-reverse' : ''}`}>
          {/* Text side */}
          <div className={`flex flex-col justify-center py-12 ${side === 'right' ? 'lg:pr-16 border-b lg:border-b-0 lg:border-r border-secondary' : 'lg:pl-16 lg:order-2 border-b lg:border-b-0 lg:border-l border-secondary'}`}>
            <p className="font-display text-7xl text-brand leading-none mb-4">{number}</p>
            <h2 className="font-display text-4xl uppercase text-ink mb-4 leading-tight">{title}</h2>
            <p className="text-gray-500 leading-relaxed max-w-md">{description}</p>
          </div>
          {/* Visual side */}
          <div className={`flex items-center justify-center py-12 px-8 bg-surface ${side === 'left' ? 'lg:order-1' : ''}`}>
            {visual}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Visual mockups ── */

function SignUpMockup() {
  return (
    <div className="w-full max-w-sm bg-white border border-secondary p-6 shadow-card">
      <p className="font-display text-2xl uppercase text-ink mb-4">Join Up.</p>
      <button className="w-full flex items-center justify-center space-x-2 border border-secondary py-2.5 text-sm mb-3 hover:border-ink">
        <span className="text-sm">G</span>
        <span>Continue with Google</span>
      </button>
      <div className="flex items-center gap-2 mb-3 text-xs text-gray-400">
        <div className="flex-1 h-px bg-secondary" /> <span>or</span> <div className="flex-1 h-px bg-secondary" />
      </div>
      <div className="space-y-2 mb-3">
        <input className="w-full border border-secondary px-3 py-2 text-sm placeholder:text-gray-400" placeholder="Your name" readOnly />
        <input className="w-full border border-secondary px-3 py-2 text-sm placeholder:text-gray-400" placeholder="Email address" readOnly />
        <input className="w-full border border-secondary px-3 py-2 text-sm placeholder:text-gray-400" placeholder="Password" readOnly />
      </div>
      <button className="w-full bg-ink text-white text-xs font-bold uppercase tracking-widest py-3">Create Account →</button>
      <p className="text-center text-xs text-gray-400 mt-3">100% free. No credit card needed.</p>
    </div>
  )
}

function CreateListMockup() {
  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="bg-white border border-secondary p-5 shadow-card">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">New list</p>
        <input className="w-full border border-secondary px-3 py-2 text-sm mb-3" defaultValue="Alex's 22nd Birthday" readOnly />
        <select className="w-full border border-secondary px-3 py-2 text-sm mb-3 bg-white">
          <option>Birthday</option>
        </select>
        <input className="w-full border border-secondary px-3 py-2 text-sm mb-4" type="date" defaultValue="2026-08-15" readOnly />
        <button className="w-full bg-brand text-ink text-xs font-bold uppercase tracking-widest py-3">Create List + Event →</button>
      </div>
      <p className="text-xs text-gray-400 text-center">A gift list is automatically created with the event</p>
    </div>
  )
}

function AddItemMockup() {
  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="bg-white border border-secondary p-5 shadow-card">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Add item</p>
        <div className="flex gap-2 mb-4">
          <input className="flex-1 border border-secondary px-3 py-2 text-xs" defaultValue="https://amazon.in/airpods-pro..." readOnly />
          <button className="bg-brand text-ink text-xs font-bold px-3 py-2">Auto-fill</button>
        </div>
        {/* Auto-filled result */}
        <div className="border border-brand bg-brand-light p-3 mb-3">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Auto-filled ✓</p>
          <div className="flex gap-3 items-center">
            <div className="w-12 h-12 bg-secondary flex-shrink-0 flex items-center justify-center">
              <span className="text-lg">🎧</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">AirPods Pro (2nd Gen)</p>
              <p className="text-xs text-gray-500">₹24,900 · Amazon</p>
            </div>
          </div>
        </div>
        <button className="w-full bg-ink text-white text-xs font-bold uppercase tracking-widest py-3">Add to List →</button>
      </div>
    </div>
  )
}

function ShareMockup() {
  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="bg-white border border-secondary p-5 shadow-card">
        <p className="font-display text-xl uppercase text-ink mb-1">Alex's Birthday List</p>
        <p className="text-xs text-gray-400 mb-4">3 items · Birthday · Aug 15</p>
        <div className="bg-surface border border-secondary px-3 py-2.5 flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500 truncate">mysanta.fun/lists/abc123</span>
          <button className="text-xs font-bold text-ink ml-2 flex-shrink-0">Copy</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button className="border border-secondary py-2 text-xs font-medium text-center hover:border-ink">Share on WhatsApp</button>
          <button className="border border-secondary py-2 text-xs font-medium text-center hover:border-ink">Copy Link</button>
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center">No sign-up required for friends to view</p>
    </div>
  )
}

function HoldMockup() {
  return (
    <div className="w-full max-w-sm space-y-2">
      {[
        { name: 'AirPods Pro (2nd Gen)', price: '₹24,900', status: 'available' },
        { name: 'Nike Air Jordan 1 Retro', price: '₹12,995', status: 'held' },
        { name: 'PS5 DualSense Controller', price: '₹5,990', status: 'available' },
      ].map(item => (
        <div key={item.name} className="bg-white border border-secondary p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-ink">{item.name}</p>
            <p className="text-xs text-gray-400">{item.price}</p>
          </div>
          {item.status === 'held' ? (
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] bg-secondary text-gray-500 px-2 py-0.5 font-bold uppercase tracking-wider">Held by someone</span>
              <button className="text-[10px] border border-secondary px-2 py-0.5 font-medium">Release</button>
            </div>
          ) : (
            <button className="text-xs bg-ink text-white px-3 py-1.5 font-bold uppercase tracking-wide">Hold</button>
          )}
        </div>
      ))}
      <p className="text-xs text-gray-400 text-center">Only available items can be held. Prevents duplicates.</p>
    </div>
  )
}

function PurchaseMockup() {
  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="bg-white border border-secondary p-5 shadow-card">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-secondary">
          <div className="w-12 h-12 bg-secondary flex items-center justify-center flex-shrink-0">
            <span className="text-lg">👟</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Nike Air Jordan 1 Retro</p>
            <p className="text-xs text-gray-400">₹12,995 · Nike India</p>
            <span className="text-[10px] bg-secondary text-gray-500 px-2 py-0.5 font-bold uppercase tracking-wider">You're holding this</span>
          </div>
        </div>
        <a href="#" className="block w-full border border-secondary text-center py-2.5 text-xs font-bold uppercase tracking-widest mb-2 hover:border-ink">
          View Product on Nike →
        </a>
        <button className="w-full bg-brand text-ink text-xs font-bold uppercase tracking-widest py-2.5">
          Mark as Purchased ✓
        </button>
      </div>
      <div className="bg-ink text-white p-4 text-xs">
        <p className="font-bold mb-0.5">After marking purchased:</p>
        <p className="text-white/60">• Item hidden from other friends' view</p>
        <p className="text-white/60">• Owner gets a notification (no spoilers)</p>
        <p className="text-white/60">• Item stays visible to owner for tracking</p>
      </div>
    </div>
  )
}

function SaveToListMockup() {
  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="bg-white border border-secondary p-5 shadow-card">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-secondary">
          <div className="w-10 h-10 bg-secondary flex-shrink-0 flex items-center justify-center text-lg">👟</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink truncate">Nike Air Jordan 1 Retro</p>
            <p className="text-xs text-gray-400">₹12,995 · Nike</p>
          </div>
        </div>
        <a href="#" className="block w-full border border-secondary text-center py-2 text-xs font-medium mb-2 hover:border-ink">View Product →</a>
        <button className="w-full bg-ink text-white text-xs font-bold uppercase tracking-widest py-2.5 mb-2">Hold this Gift</button>
        {/* The new button */}
        <div className="border border-secondary">
          <button className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-ink hover:bg-surface">
            <span className="text-base leading-none">+</span>
            <span>Save to my list</span>
          </button>
          {/* Dropdown open state */}
          <div className="border-t border-secondary">
            <p className="text-[10px] text-gray-400 px-3 pt-2 pb-1 uppercase tracking-wider font-bold">Your lists</p>
            {["My Birthday List", "Christmas Wishlist", "Random Wants"].map(l => (
              <div key={l} className="px-3 py-2 text-xs font-medium text-ink hover:bg-surface border-b border-secondary last:border-b-0 cursor-pointer">{l}</div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center">Item is copied to your list — ready to share with your own friends.</p>
    </div>
  )
}

function ChipInMockup() {
  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="bg-white border border-secondary p-5 shadow-card">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-secondary">
          <div>
            <p className="text-sm font-semibold text-ink">Sony WH-1000XM5</p>
            <p className="text-xs text-gray-400">₹29,990 · Amazon</p>
          </div>
          <span className="text-[10px] bg-secondary px-2 py-1 font-bold uppercase tracking-wide text-gray-600">
            3 chipping in
          </span>
        </div>
        {/* Collaborators */}
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Chipping in</p>
          <div className="flex items-center gap-2 flex-wrap">
            {['Rahul', 'Sneha', 'Arjun'].map((name, i) => (
              <div key={name} className="flex items-center gap-1.5 bg-surface border border-secondary px-2.5 py-1.5 rounded-full">
                <div className="w-5 h-5 rounded-full bg-ink flex items-center justify-center text-[9px] text-white font-bold">{name[0]}</div>
                <span className="text-xs font-medium text-ink">{name}</span>
              </div>
            ))}
          </div>
        </div>
        <button className="w-full bg-brand text-white text-xs font-bold uppercase tracking-widest py-2.5 mb-2 hover:bg-brand-dark transition-colors">
          Join Collaboration →
        </button>
        <p className="text-[10px] text-gray-400 text-center">Split ₹29,990 across 4 people = ~₹7,500 each</p>
      </div>
      <div className="bg-ink text-white p-4 text-xs space-y-1">
        <p className="font-bold mb-1.5">How chipping in works:</p>
        <p className="text-white/60">• Anyone can join a held item as a collaborator</p>
        <p className="text-white/60">• The item shows as "Held by a group" to others</p>
        <p className="text-white/60">• All collaborators coordinate the purchase off-platform</p>
        <p className="text-white/60">• One person marks it purchased when done</p>
      </div>
    </div>
  )
}

function OwnerViewMockup() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Your view (owner)</p>
        <span className="text-[10px] bg-ink text-white px-2 py-0.5 uppercase tracking-wide">You</span>
      </div>
      {[
        { name: 'AirPods Pro', status: 'WISHED', show: true },
        { name: 'Nike Jordan 1', status: 'ON_HOLD', show: true },
        { name: 'PS5 Controller', status: 'PURCHASED', show: true },
      ].map(item => (
        <div key={item.name} className="bg-white border border-secondary px-4 py-3 flex items-center justify-between">
          <p className="text-sm font-medium text-ink">{item.name}</p>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${
            item.status === 'PURCHASED' ? 'bg-brand text-ink' :
            item.status === 'ON_HOLD' ? 'bg-secondary text-gray-600' :
            'border border-secondary text-gray-500'
          }`}>{item.status.replace('_',' ')}</span>
        </div>
      ))}
      <div className="mt-3 border-t border-secondary pt-3">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Friends' view</p>
        {[
          { name: 'AirPods Pro', show: true },
          { name: 'Nike Jordan 1', show: true },
        ].map(item => (
          <div key={item.name} className="bg-surface border border-secondary px-4 py-3 flex items-center justify-between mb-1 opacity-70">
            <p className="text-sm font-medium text-ink">{item.name}</p>
            <span className="text-[10px] text-gray-400">visible</span>
          </div>
        ))}
        <div className="bg-surface border border-dashed border-secondary px-4 py-3 flex items-center justify-between opacity-40">
          <p className="text-sm text-gray-400 line-through">PS5 Controller</p>
          <span className="text-[10px] text-gray-400">hidden</span>
        </div>
      </div>
    </div>
  )
}
