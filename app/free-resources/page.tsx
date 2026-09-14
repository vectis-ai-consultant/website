import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import '../free-resources.css'
import ProgressBar from '@/components/ProgressBar'

export const metadata: Metadata = {
  title: 'Free resources',
  description: 'Skills and workflows you can hand to your AI agent today. Copy and paste, and it works today.',
}

export default function FreeResourcesPage() {
  return (
    <>
      <ProgressBar />
      <Nav active="resources" />
      <section id="resHero" style={{ maxWidth: '1200px', margin: '0 auto', padding: '170px 56px 40px', textAlign: 'center', scrollMarginTop: '110px' }}>
          <p style={{ fontSize: '13px', letterSpacing: '.22em', color: '#7b83a8', fontWeight: '600', margin: '0 0 22px' }}>FREE RESOURCES</p>
          <h1 id="resH1" style={{ fontFamily: 'Georgia,\'Times New Roman\',serif', fontSize: '76px', fontWeight: '700', letterSpacing: '-.03em', lineHeight: '1.02', margin: '0 auto 26px', maxWidth: '820px', textWrap: 'balance' }}>An AI toolbox for your business.</h1>
          <p style={{ fontSize: '19px', color: '#4a4f70', lineHeight: '1.6', margin: '0 auto', maxWidth: '560px', textWrap: 'pretty' }}>Skills and workflows you can hand to your AI agent today. Copy &amp; paste, and it works today.</p>
        </section>

        <section id="resources" style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 56px 100px', scrollMarginTop: '110px' }}>
          <div id="resGrid" data-stagger="1" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '28px', maxWidth: '820px', margin: '0 auto' }}>

            <a href="#" className="rcard" style={{ background: '#e4e5eb', borderRadius: '28px', padding: '36px 34px 34px', display: 'flex', flexDirection: 'column', color: '#1a1740', minHeight: '380px', boxSizing: 'border-box' }}>
              <div data-icon="1" style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#f2f5fb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '44px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1740" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 4v16" /><path d="M7 8c0 4 10 2 10 6" /><path d="M7 20a2 2 0 100-4 2 2 0 000 4zM7 8a2 2 0 100-4 2 2 0 000 4zM17 18a2 2 0 100-4 2 2 0 000 4z" /></svg>
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-.015em', lineHeight: '1.25', margin: '0 0 16px', textWrap: 'pretty' }}>Inbox triage workflow</h3>
              <p style={{ fontSize: '16px', color: '#4a4f70', lineHeight: '1.7', margin: '0 0 36px', flex: '1', textWrap: 'pretty' }}>A Make / n8n template that reads incoming email, sorts it into customer, vendor, billing and spam, drafts replies for the routine ones and flags the rest to you.</p>
              <span data-cta="1" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '700', transition: 'color .3s' }}>Read the guide <span data-arrow="1" style={{ display: 'inline-block', transition: 'transform .3s', fontSize: '14px' }}>›</span></span>
            </a>

            <Link href="/blog/poster-ad-batch" className="rcard" style={{ background: '#e4e5eb', borderRadius: '28px', padding: '36px 34px 34px', display: 'flex', flexDirection: 'column', color: '#1a1740', minHeight: '380px', boxSizing: 'border-box' }}>
              <div data-icon="1" style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#f2f5fb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '44px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1740" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" /></svg>
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-.015em', lineHeight: '1.25', margin: '0 0 16px', textWrap: 'pretty' }}>Poster ad batch maker</h3>
              <p style={{ fontSize: '16px', color: '#4a4f70', lineHeight: '1.7', margin: '0 0 36px', flex: '1', textWrap: 'pretty' }}>Point it at ad formats that already worked for you and one product. It digests each layout into named levers, crosses them into variants, and hands you a contact sheet to pick the keepers from.</p>
              <span data-cta="1" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '700', transition: 'color .3s' }}>Read the guide <span data-arrow="1" style={{ display: 'inline-block', transition: 'transform .3s', fontSize: '14px' }}>›</span></span>
            </Link>

          </div>
        </section>

        <section data-reveal="1" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 56px 100px' }}>
          <div id="ctaBanner" style={{ background: '#d3d7e9', borderRadius: '16px', padding: '40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '12px', letterSpacing: '.16em', color: '#2a2360', fontWeight: '600', marginBottom: '10px' }}>WANT THIS APPLIED TO YOUR WORKFLOW?</div>
              <h2 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-.02em', margin: '0 0 8px' }}>Book a free 30-minute discovery call</h2>
              <p style={{ fontSize: '15px', color: '#4a4f70', margin: '0', lineHeight: '1.6', textWrap: 'pretty' }}>Fill in the prep sheet, bring one workflow that eats your team's time, and leave with a clear plan.</p>
            </div>
            <Link href="/#contact" className="hv5" style={{ flexShrink: '0', display: 'inline-flex', alignItems: 'center', gap: '12px', background: '#1a1740', color: '#f2f5fb', borderRadius: '999px', padding: '18px 32px', fontSize: '16px', fontWeight: '700', transition: 'transform .2s,background .2s' }}>Book a discovery call <span style={{ fontSize: '18px' }} aria-hidden="true">→</span></Link>
          </div>
        </section>

        <footer data-reveal="1" style={{ padding: '0 56px 120px', overflow: 'hidden' }}>
          <div id="footerMark" style={{ fontSize: '160px', fontWeight: '700', lineHeight: '1', color: '#dee5f4', letterSpacing: '-.03em', textAlign: 'center', whiteSpace: 'nowrap', userSelect: 'none' }} aria-hidden="true">VECTIS AI</div>
          <div id="footerBar" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', fontSize: '13px', color: '#7b83a8' }}>
            <span>© 2026 Vectis AI</span>
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="https://linkedin.com/in/steric-tsui" className="fmuted" target="_blank" rel="noopener">LinkedIn</a>
              <a href="https://github.com/stericishere" className="fmuted" target="_blank" rel="noopener">GitHub</a>
            </div>
          </div>
        </footer>
    </>
  )
}
