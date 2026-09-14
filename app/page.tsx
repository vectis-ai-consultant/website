import Link from 'next/link'
import Nav from '@/components/Nav'
import ProgressBar from '@/components/ProgressBar'
import BookingFlow from '@/components/BookingFlow'
import ContactFlow from '@/components/ContactFlow'
import HoursGrid from '@/components/HoursGrid'
import ProcessRail from '@/components/ProcessRail'
import ScrollHook from '@/components/ScrollHook'
import HomeBehaviors from '@/components/HomeBehaviors'
import StoryScene from '@/components/StoryScene'
import './home.css'
import './ball-hero.css'

// Client logos for the social-proof band. Empty on purpose: a "trusted by" row
// with names we cannot actually publish is a lie, so the section renders nothing
// until there is something real in here. Drop a file in public/assets/logos/clients/
// and add a row — `logo` is optional; the name sets in mono without one.
const CLIENTS: { name: string; logo?: string }[] = []

const CLIENTS_HEADING = 'Who we have built for'
const CLIENTS_SUBLINE = 'A wide range of operations, from small teams running on spreadsheets to businesses with a system already in place.'

export default function HomePage() {
  return (
    <>
      <ProgressBar standalone={false} />
      <Nav />
      <div style={{ minHeight: '100vh', background: '#f2f5fb', color: '#1a1740' }}>

        <div id="introOverlay" hidden={true} style={{ position: 'fixed', inset: '0', zIndex: '110', background: '#f2f5fb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#3a4fae', fontSize: '110px', fontWeight: '800', letterSpacing: '.12em', animation: 'intro-zoom 2.4s cubic-bezier(.55,0,.55,1) forwards, intro-glow 2.4s ease-out forwards' }}>VECTIS</span>
        </div>

        {/* The story: one pinned 3D stage, three acts on top of it. You open
            on the ball from overhead, scroll dives into it and resolves into
            the side-by-side; the second act brings it back to the middle with
            the Vectis mark inside and the tools circling it; the third breaks
            the ball apart and rebuilds its dust as the leverage, with the mark
            turned over into the fulcrum. All of it is driven from scroll
            position, so it reverses exactly. See lib/ball-state.ts. */}
        {/* Brand and the one call to action, outside the story so they sit in the
            page's own stacking context: pinned inside the hero they scrolled away
            with it, and they were painted under the docked nav. */}
        <div id="introTopBar">
          <div className="intro-brand">
            <img src="/assets/logos/vectis-lambda.png" alt="" aria-hidden="true" />
            <span role="img" aria-label="Vectis AI">vectis<sup>ai</sup></span>
          </div>
          <div className="intro-meta">
            <span className="intro-place">TORONTO · CANADA</span>
            <a href="#contact" className="intro-cta">Book a discovery call <span aria-hidden="true">→</span></a>
          </div>
        </div>

        <div className="story" id="story">
          {/* The 3D layer. Sticky for the whole run of the story and pulled
              back out of the flow, so the three acts scroll over it. */}
          <div className="story-stage" aria-hidden="true">
            <div className="hero-bleed" />
            <div className="ball-bloom" />
            <StoryScene storyId="story" act1Id="intro" act2Id="orbit" act3Id="lever" />
          </div>

          <section id="intro" className="ball-stage">
            <div className="ball-sticky">
            <div className="ball-copy" id="heroText">
              <p className="hero-note"><b>Open</b> Taking on new client projects</p>
              <h1 id="heroH1"><span id="rotBox" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}><span id="rotWord" style={{ display: 'inline-block', transformOrigin: 'left bottom', transition: 'opacity .3s ease', opacity: '1' }}>Same</span></span> team.<br /><span id="rotTail" style={{ display: 'inline-block', transition: 'opacity .3s ease', opacity: '1' }}>Bigger <em>possibilities.</em></span></h1>
              <p className="ball-lede" id="heroBody"></p>
              <div className="ball-dots" id="heroDots"></div>
              {/* Both of these are claims the site already makes further down —
                  nothing invented, and no borrowed proof. */}
              <div className="hero-badges">
                <span className="hero-badge">
                  <i className="badge-mark">01</i>
                  <span><b>WHAT IT TAKES</b>Works on day 1 — no migration</span>
                </span>
                <span className="hero-badge">
                  <i className="badge-mark">02</i>
                  <span><b>FIRST STEP</b>Free 30-minute discovery call</span>
                </span>
              </div>
              <p className="hero-claim">The only business AI consulting you need.</p>
            </div>

            <div className="ball-leverage">
              <h2>Every tool already exists.<br /><em>The hours don&rsquo;t.</em></h2>
              {/* The three bullets that used to sit here are the labels on the
                  grid now: the week filling up says it faster than they did. */}
              <HoursGrid />
              <p className="ball-note">The work that repeats takes the week. The work that compounds waits.</p>
            </div>
            </div>
          </section>

          <section id="orbit" className="orbit-stage">
            <div className="act-sticky">
              <div className="act-copy orbit-copy">
                <span className="act-num">02 — WHAT WE DO ABOUT IT</span>
                <h2>You bring the ambition.<br /><em>We bring the leverage.</em></h2>
                <p>Your people, your tools, more room to move. We build AI into the systems you already operate &mdash; no migration, no new logins, nothing for your team to learn first.</p>
              </div>
            </div>
          </section>

          <section id="lever" className="lever-stage">
            <div className="act-sticky">
              <div className="act-copy lever-copy">
                <span className="act-num">03 — THE VECTIS EFFECT</span>
                <h2>A little leverage.<br /><em>Everything else moves.</em></h2>
                <p>The same eight tools, arranged so a small team can lift something much bigger than itself.</p>
              </div>
            </div>
          </section>

          {/* .story closes at the very bottom of the page: the 3D stage is
              sticky for as long as its container runs, so stretching the
              container is what carries one scene behind every section. */}


          {CLIENTS.length > 0 && (
            <section id="clients" data-reveal="1" style={{ padding: '20px 56px 60px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{ fontSize: '30px', fontWeight: '700', letterSpacing: '-.02em', margin: '0 0 12px' }}>{CLIENTS_HEADING}</h2>
              <p style={{ fontSize: '15px', color: '#4a4f70', lineHeight: '1.7', margin: '0 auto 34px', maxWidth: '620px' }}>{CLIENTS_SUBLINE}</p>
              <ul style={{ listStyle: 'none', margin: '0', padding: '0', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '20px 56px' }}>
                {CLIENTS.map((cl) => (
                  <li key={cl.name}>
                    {cl.logo
                      ? <img src={cl.logo} alt={cl.name} style={{ height: '34px', width: 'auto', display: 'block', filter: 'grayscale(1)', opacity: '.7' }} />
                      : <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '15px', color: '#4a4f70' }}>{cl.name}</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <ScrollHook eyebrow="SO WHAT DO WE ACTUALLY BUILD" line="Four ways to buy back the hours the work keeps eating." />

          <section id="services" data-reveal="1" style={{ padding: '60px 56px 40px', maxWidth: '1200px', margin: '0 auto', scrollMarginTop: '110px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '28px', marginBottom: '28px' }}>
              <span data-num="1" style={{ fontSize: '120px', fontWeight: '300', lineHeight: '.8', color: '#bcc9e6', fontFamily: 'Georgia,serif', letterSpacing: '-.02em' }}>01</span>
              <span style={{ fontSize: '13px', letterSpacing: '.18em', color: '#1a1740', fontWeight: '600', paddingBottom: '6px' }}>OUR SOLUTION</span>
            </div>
            <h2 id="servicesHead" style={{ fontSize: '52px', fontWeight: '700', letterSpacing: '-.025em', lineHeight: '1.08', margin: '0 0 80px', maxWidth: '760px', textWrap: 'pretty' }}>Four ways we bring AI into your business.</h2>
            <div id="servicesGrid" data-stagger="1" style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '64px', alignItems: 'start' }}>
              <div id="systemsList" style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid #b5bacf' }}></div>
              <div>
                <div id="panelStage" style={{ position: 'relative', background: '#fbfcfe', border: '1px solid #dde4f3', borderRadius: '16px', height: '520px', overflow: 'hidden' }}>

              <div data-panel="operations" hidden={true}>
                <div style={{ position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'panel-in .5s ease both' }}>
                  <div style={{ width: '440px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}><div style={{ fontSize: '12px', letterSpacing: '.14em', color: '#7b83a8' }}>SOP · VISA APPLICATION</div><div style={{ fontSize: '12px', color: '#1a1740', fontWeight: '600', background: '#d3d7e9', borderRadius: '999px', padding: '6px 12px' }}>Agent running</div></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr auto', gap: '14px', alignItems: 'center', background: '#fff', border: '1px solid #dde4f3', borderRadius: '12px', padding: '14px 16px', animation: 'row-loop 7s ease infinite', animationDelay: '.1s' }}><div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1a1740', color: '#f2f5fb', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</div><div><div style={{ fontSize: '14px', fontWeight: '600' }}>Collect documents from client</div><div style={{ fontSize: '12px', color: '#7b83a8', marginTop: '2px' }}>Email + portal upload, checked against the checklist</div></div><div style={{ fontSize: '12px', color: '#3a4fae', fontWeight: '600' }}>✓ done</div></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr auto', gap: '14px', alignItems: 'center', background: '#fff', border: '1px solid #dde4f3', borderRadius: '12px', padding: '14px 16px', animation: 'row-loop 7s ease infinite', animationDelay: '.3s' }}><div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1a1740', color: '#f2f5fb', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</div><div><div style={{ fontSize: '14px', fontWeight: '600' }}>Fill in application forms</div><div style={{ fontSize: '12px', color: '#7b83a8', marginTop: '2px' }}>Data entry from the documents, field by field</div></div><div style={{ fontSize: '12px', color: '#3a4fae', fontWeight: '600' }}>✓ done</div></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr auto', gap: '14px', alignItems: 'center', background: '#d3d7e9', border: '1px solid #3a4fae', borderRadius: '12px', padding: '14px 16px', animation: 'row-loop 7s ease infinite', animationDelay: '.5s' }}><div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1.5px solid #3a4fae', color: '#2a2360', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✋</div><div><div style={{ fontSize: '11px', letterSpacing: '.14em', color: '#2a2360', marginBottom: '2px' }}>APPROVAL GATE</div><div style={{ fontSize: '14px', fontWeight: '600' }}>Review before submission</div></div><div style={{ display: 'flex', gap: '6px' }}><span style={{ fontSize: '12px', fontWeight: '600', background: '#1a1740', color: '#f2f5fb', borderRadius: '999px', padding: '7px 12px' }}>Approve</span><span style={{ fontSize: '12px', fontWeight: '600', border: '1px solid #3a4fae', borderRadius: '999px', padding: '7px 12px' }}>Edit</span></div></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr auto', gap: '14px', alignItems: 'center', background: '#fff', border: '1px dashed #b5bacf', borderRadius: '12px', padding: '14px 16px', opacity: '.6', animation: 'row-loop 7s ease infinite', animationDelay: '.7s' }}><div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1.5px solid #b5bacf', color: '#7b83a8', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</div><div><div style={{ fontSize: '14px', fontWeight: '600' }}>Submit and track status</div><div style={{ fontSize: '12px', color: '#7b83a8', marginTop: '2px' }}>Client notified at every update</div></div><div style={{ fontSize: '12px', color: '#7b83a8' }}>waiting</div></div>
                    <div style={{ fontSize: '12px', color: '#7b83a8', marginTop: '6px', animation: 'row-loop 7s ease infinite', animationDelay: '.9s' }}>Same pattern for any SOP — e.g. automatic data entry into an accounting platform.</div>
                  </div>
                </div>
              </div>

              <div data-panel="social" hidden={true}>
                <div style={{ position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'panel-in .5s ease both' }}>
                  <div style={{ width: '440px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', gap: '8px', animation: 'row-loop 7s ease infinite' }}>
                      <span style={{ fontSize: '12px', fontWeight: '600', border: '1px solid #dde4f3', borderRadius: '999px', padding: '6px 12px', background: '#fff' }}>Instagram</span><span style={{ fontSize: '12px', fontWeight: '600', border: '1px solid #dde4f3', borderRadius: '999px', padding: '6px 12px', background: '#fff' }}>TikTok</span><span style={{ fontSize: '12px', fontWeight: '600', border: '1px solid #dde4f3', borderRadius: '999px', padding: '6px 12px', background: '#fff' }}>RedNote 小红书</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      <div style={{ background: '#fff', border: '1px solid #dde4f3', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', animation: 'row-loop 7s ease infinite', animationDelay: '.2s' }}><div style={{ fontSize: '11px', letterSpacing: '.12em', color: '#2a2360' }}>TEXT</div><div style={{ height: '92px', borderRadius: '8px', background: '#f0f1f7', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px', overflow: 'hidden' }}><div style={{ height: '8px', borderRadius: '4px', background: '#1a1740', width: '70%' }}></div><div style={{ height: '6px', borderRadius: '3px', background: '#c0c6dc', width: '100%' }}></div><div style={{ height: '6px', borderRadius: '3px', background: '#c0c6dc', width: '92%' }}></div><div style={{ height: '6px', borderRadius: '3px', background: '#c0c6dc', width: '60%' }}></div><div style={{ fontSize: '10px', color: '#7b83a8', marginTop: 'auto' }}>#newarrival #handmade</div></div><div style={{ fontSize: '12px', color: '#7b83a8' }}>Caption + hashtags, per platform</div></div>
                      <div style={{ background: '#fff', border: '1px solid #dde4f3', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', animation: 'row-loop 7s ease infinite', animationDelay: '.4s' }}><div style={{ fontSize: '11px', letterSpacing: '.12em', color: '#2a2360' }}>COMMERCIAL VIDEO</div><div style={{ height: '92px', borderRadius: '8px', background: 'linear-gradient(135deg,#e6e8f0,#d3d7e9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1a1740', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: '0', height: '0', borderLeft: '9px solid #f2f5fb', borderTop: '6px solid transparent', borderBottom: '6px solid transparent', marginLeft: '3px' }}></div></div></div><div style={{ fontSize: '12px', color: '#7b83a8' }}>16:9 · 30s ad cut</div></div>
                      <div style={{ background: '#fff', border: '1px solid #dde4f3', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', animation: 'row-loop 7s ease infinite', animationDelay: '.6s' }}><div style={{ fontSize: '11px', letterSpacing: '.12em', color: '#2a2360' }}>SHORT-FORM VIDEO</div><div style={{ height: '92px', borderRadius: '8px', background: 'linear-gradient(135deg,#d3d7e9,#c0c6dc)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: '34px', height: '60px', borderRadius: '6px', background: '#1a1740', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: '0', height: '0', borderLeft: '7px solid #f2f5fb', borderTop: '5px solid transparent', borderBottom: '5px solid transparent', marginLeft: '2px' }}></div></div></div><div style={{ fontSize: '12px', color: '#7b83a8' }}>9:16 · 15s reel / TikTok</div></div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1a1740', color: '#f2f5fb', borderRadius: '12px', padding: '16px 18px', animation: 'row-loop 7s ease infinite', animationDelay: '.7s' }}>
                      <div><div style={{ fontSize: '11px', letterSpacing: '.14em', color: '#9499aa', marginBottom: '4px' }}>HUMAN APPROVAL GATE</div><div style={{ fontSize: '14px', fontWeight: '600' }}>3 posts waiting for your OK</div></div>
                      <div style={{ display: 'flex', gap: '8px' }}><span style={{ fontSize: '12px', fontWeight: '600', background: '#3a4fae', color: '#1a1740', borderRadius: '999px', padding: '8px 14px' }}>Approve</span><span style={{ fontSize: '12px', fontWeight: '600', border: '1px solid #44423e', borderRadius: '999px', padding: '8px 14px' }}>Edit</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <div data-panel="chatbot" hidden={true}>
                <div style={{ position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'panel-in .5s ease both' }}>
                  <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '12px', letterSpacing: '.14em', color: '#7b83a8', marginBottom: '6px' }}>ON YOUR WEBSITE · 24/7</div>
                    <div style={{ alignSelf: 'flex-end', maxWidth: '78%', background: '#1a1740', color: '#f2f5fb', borderRadius: '16px 16px 4px 16px', padding: '12px 16px', fontSize: '14px', lineHeight: '1.5', animation: 'row-loop 7s ease infinite' }}>Do you ship to Vancouver, and how long does it take?</div>
                    <div style={{ alignSelf: 'flex-start', maxWidth: '82%', background: '#fff', border: '1px solid #dde4f3', borderRadius: '16px 16px 16px 4px', padding: '12px 16px', fontSize: '14px', lineHeight: '1.5', animation: 'row-loop 7s ease infinite', animationDelay: '.6s' }}>Yes — 2 to 3 business days. Free over $80. Want me to check stock on the item you were viewing?</div>
                    <div style={{ alignSelf: 'flex-end', maxWidth: '78%', background: '#1a1740', color: '#f2f5fb', borderRadius: '16px 16px 4px 16px', padding: '12px 16px', fontSize: '14px', lineHeight: '1.5', animation: 'row-loop 7s ease infinite', animationDelay: '1.4s' }}>Yes please</div>
                    <div style={{ alignSelf: 'flex-start', background: '#fff', border: '1px solid #dde4f3', borderRadius: '16px 16px 16px 4px', padding: '14px 18px', display: 'flex', gap: '5px', animation: 'row-loop 7s ease infinite', animationDelay: '2s' }}><div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3a4fae', animation: 'pulse 1.2s infinite' }}></div><div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3a4fae', animation: 'pulse 1.2s infinite .2s' }}></div><div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3a4fae', animation: 'pulse 1.2s infinite .4s' }}></div></div>
                    <div style={{ fontSize: '12px', color: '#7b83a8', marginTop: '8px', animation: 'row-loop 7s ease infinite', animationDelay: '2.4s' }}>Grounded in your business data, prices, and policies.</div>
                  </div>
                </div>
              </div>

              <div data-panel="crm" hidden={true}>
                <div style={{ position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'panel-in .5s ease both' }}>
                  <div style={{ width: '440px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}><div style={{ fontSize: '12px', letterSpacing: '.14em', color: '#7b83a8' }}>PIPELINE · LIVE</div><div style={{ fontSize: '12px', color: '#1a1740', fontWeight: '600', background: '#d3d7e9', borderRadius: '999px', padding: '6px 12px' }}>Agent following up</div></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      <div style={{ background: '#fff', border: '1px solid #dde4f3', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', animation: 'row-loop 7s ease infinite', animationDelay: '.1s' }}><div style={{ fontSize: '11px', letterSpacing: '.12em', color: '#7b83a8' }}>NEW LEAD</div><div style={{ height: '12px', borderRadius: '6px', background: '#dde4f3', width: '100%' }}></div><div style={{ height: '12px', borderRadius: '6px', background: '#dde4f3', width: '70%' }}></div><div style={{ fontSize: '12px', color: '#7b83a8', marginTop: '4px' }}>Enriched · scored 82</div></div>
                      <div style={{ background: '#fff', border: '1px solid #3a4fae', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', animation: 'row-loop 7s ease infinite', animationDelay: '.35s' }}><div style={{ fontSize: '11px', letterSpacing: '.12em', color: '#3a4fae' }}>FOLLOW-UP</div><div style={{ height: '12px', borderRadius: '6px', background: '#d3d7e9', width: '100%' }}></div><div style={{ height: '12px', borderRadius: '6px', background: '#d3d7e9', width: '85%' }}></div><div style={{ fontSize: '12px', color: '#2a2360', marginTop: '4px' }}>Drafted · sends 9:00</div></div>
                      <div style={{ background: '#fff', border: '1px solid #dde4f3', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', animation: 'row-loop 7s ease infinite', animationDelay: '.6s' }}><div style={{ fontSize: '11px', letterSpacing: '.12em', color: '#7b83a8' }}>CLOSED</div><div style={{ height: '12px', borderRadius: '6px', background: '#1a1740', width: '100%' }}></div><div style={{ height: '12px', borderRadius: '6px', background: '#1a1740', width: '60%' }}></div><div style={{ fontSize: '12px', color: '#7b83a8', marginTop: '4px' }}>CRM updated</div></div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1a1740', color: '#f2f5fb', borderRadius: '12px', padding: '16px 18px', marginTop: '6px', animation: 'row-loop 7s ease infinite', animationDelay: '.9s' }}>
                      <div><div style={{ fontSize: '11px', letterSpacing: '.14em', color: '#9499aa', marginBottom: '4px' }}>NO LEAD LEFT WAITING</div><div style={{ fontSize: '14px', fontWeight: '600' }}>Every inquiry answered within 5 minutes</div></div>
                      <div style={{ fontSize: '13px', color: '#3a4fae', fontWeight: '600' }}>HubSpot · Notion · Sheets</div>
                    </div>
                  </div>
                </div>
              </div>
              <div data-panel="seo" hidden={true}>
                <div style={{ position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'panel-in .5s ease both' }}>
                  <div style={{ width: '440px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '12px', letterSpacing: '.14em', color: '#7b83a8', marginBottom: '6px' }}>WHERE YOUR CUSTOMERS SEARCH</div>
                    <div style={{ background: '#fff', border: '1px solid #dde4f3', borderRadius: '12px', padding: '14px 16px', animation: 'row-loop 7s ease infinite', animationDelay: '0.1s' }}><div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}><div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #1a1740' }}></div><div style={{ flex: '1', height: '12px', borderRadius: '6px', background: '#dde4f3' }}></div></div><div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3a4fae' }}></div><div style={{ fontSize: '13px', fontWeight: '600' }}>Your business</div><div style={{ fontSize: '11px', color: '#2a2360', background: '#d3d7e9', borderRadius: '999px', padding: '3px 8px', marginLeft: 'auto' }}>#1</div></div><div style={{ height: '10px', borderRadius: '5px', background: '#e6e8f0', width: '80%' }}></div><div style={{ height: '10px', borderRadius: '5px', background: '#e6e8f0', width: '65%' }}></div></div></div>
                    <div style={{ background: '#fff', border: '1px solid #dde4f3', borderRadius: '12px', padding: '14px 16px', animation: 'row-loop 7s ease infinite', animationDelay: '0.4s', borderColor: '#3a4fae' }}><div style={{ fontSize: '11px', letterSpacing: '.12em', color: '#3a4fae', marginBottom: '8px' }}>AI SEARCH ANSWER</div><div style={{ fontSize: '13px', lineHeight: '1.55', color: '#343061' }}>“For this in Toronto, <span style={{ background: '#d3d7e9', fontWeight: '600', padding: '1px 4px', borderRadius: '4px' }}>your business</span> is the most recommended option — cited by 4 sources.”</div></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', animation: 'row-loop 7s ease infinite', animationDelay: '.7s' }}>
                      <div style={{ background: '#1a1740', color: '#f2f5fb', borderRadius: '12px', padding: '14px' }}><div style={{ fontSize: '11px', letterSpacing: '.12em', color: '#9499aa' }}>ORGANIC VISITS</div><div style={{ fontSize: '22px', fontWeight: '700', marginTop: '6px' }}>+140%</div></div>
                      <div style={{ background: '#fff', border: '1px solid #dde4f3', borderRadius: '12px', padding: '14px' }}><div style={{ fontSize: '11px', letterSpacing: '.12em', color: '#7b83a8' }}>GOOGLE ADS ROAS</div><div style={{ fontSize: '22px', fontWeight: '700', marginTop: '6px' }}>4.2×</div></div>
                      <div style={{ background: '#fff', border: '1px solid #dde4f3', borderRadius: '12px', padding: '14px' }}><div style={{ fontSize: '11px', letterSpacing: '.12em', color: '#7b83a8' }}>AI CITATIONS</div><div style={{ fontSize: '22px', fontWeight: '700', marginTop: '6px' }}>12</div></div>
                    </div>
                  </div>
                </div>
              </div>
              <div data-panel="grow" hidden={true}>
                <div style={{ position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'panel-in .5s ease both' }}>
                  <div style={{ width: '440px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}><div style={{ fontSize: '12px', letterSpacing: '.14em', color: '#7b83a8' }}>NEW ACCOUNT · WEEK 1 → WEEK 12</div><div style={{ fontSize: '12px', color: '#1a1740', fontWeight: '600', background: '#d3d7e9', borderRadius: '999px', padding: '6px 12px' }}>Posting daily</div></div>
                    <div style={{ background: '#fff', border: '1px solid #dde4f3', borderRadius: '12px', padding: '18px 16px 12px', animation: 'row-loop 7s ease infinite', animationDelay: '.1s' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '110px' }}>
                        <div style={{ flex: '1', background: '#dde4f3', borderRadius: '4px 4px 0 0', height: '8%', transformOrigin: 'bottom', animation: 'bar-grow 7s ease infinite', animationDelay: '0.20s' }}></div><div style={{ flex: '1', background: '#dde4f3', borderRadius: '4px 4px 0 0', height: '12%', transformOrigin: 'bottom', animation: 'bar-grow 7s ease infinite', animationDelay: '0.32s' }}></div><div style={{ flex: '1', background: '#dde4f3', borderRadius: '4px 4px 0 0', height: '15%', transformOrigin: 'bottom', animation: 'bar-grow 7s ease infinite', animationDelay: '0.44s' }}></div><div style={{ flex: '1', background: '#c0c6dc', borderRadius: '4px 4px 0 0', height: '22%', transformOrigin: 'bottom', animation: 'bar-grow 7s ease infinite', animationDelay: '0.56s' }}></div><div style={{ flex: '1', background: '#c0c6dc', borderRadius: '4px 4px 0 0', height: '28%', transformOrigin: 'bottom', animation: 'bar-grow 7s ease infinite', animationDelay: '0.68s' }}></div><div style={{ flex: '1', background: '#c0c6dc', borderRadius: '4px 4px 0 0', height: '36%', transformOrigin: 'bottom', animation: 'bar-grow 7s ease infinite', animationDelay: '0.80s' }}></div><div style={{ flex: '1', background: '#b5bacf', borderRadius: '4px 4px 0 0', height: '45%', transformOrigin: 'bottom', animation: 'bar-grow 7s ease infinite', animationDelay: '0.92s' }}></div><div style={{ flex: '1', background: '#b5bacf', borderRadius: '4px 4px 0 0', height: '52%', transformOrigin: 'bottom', animation: 'bar-grow 7s ease infinite', animationDelay: '1.04s' }}></div><div style={{ flex: '1', background: '#3a4fae', borderRadius: '4px 4px 0 0', height: '64%', transformOrigin: 'bottom', animation: 'bar-grow 7s ease infinite', animationDelay: '1.16s' }}></div><div style={{ flex: '1', background: '#3a4fae', borderRadius: '4px 4px 0 0', height: '75%', transformOrigin: 'bottom', animation: 'bar-grow 7s ease infinite', animationDelay: '1.28s' }}></div><div style={{ flex: '1', background: '#1a1740', borderRadius: '4px 4px 0 0', height: '88%', transformOrigin: 'bottom', animation: 'bar-grow 7s ease infinite', animationDelay: '1.40s' }}></div><div style={{ flex: '1', background: '#1a1740', borderRadius: '4px 4px 0 0', height: '100%', transformOrigin: 'bottom', animation: 'bar-grow 7s ease infinite', animationDelay: '1.52s' }}></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#7b83a8', marginTop: '8px' }}><span>0 followers</span><span>12,400 followers</span></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      <div style={{ background: '#fff', border: '1px solid #dde4f3', borderRadius: '12px', padding: '14px 16px', animation: 'row-loop 7s ease infinite', animationDelay: '0.4s' }}><div style={{ fontSize: '11px', letterSpacing: '.12em', color: '#7b83a8' }}>SET UP</div><div style={{ fontSize: '13px', fontWeight: '600', marginTop: '6px' }}>Bio, links, brand kit</div></div>
                      <div style={{ background: '#fff', border: '1px solid #dde4f3', borderRadius: '12px', padding: '14px 16px', animation: 'row-loop 7s ease infinite', animationDelay: '0.55s' }}><div style={{ fontSize: '11px', letterSpacing: '.12em', color: '#7b83a8' }}>CADENCE</div><div style={{ fontSize: '13px', fontWeight: '600', marginTop: '6px' }}>1 post / day, 3 platforms</div></div>
                      <div style={{ background: '#fff', border: '1px solid #dde4f3', borderRadius: '12px', padding: '14px 16px', animation: 'row-loop 7s ease infinite', animationDelay: '0.7s', borderColor: '#3a4fae' }}><div style={{ fontSize: '11px', letterSpacing: '.12em', color: '#3a4fae' }}>LEARN</div><div style={{ fontSize: '13px', fontWeight: '600', marginTop: '6px' }}>Double down on what works</div></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#d3d7e9', borderRadius: '12px', padding: '14px 18px', animation: 'row-loop 7s ease infinite', animationDelay: '.9s' }}><div style={{ fontSize: '14px', fontWeight: '600' }}>You approve the weekly plan</div><div style={{ fontSize: '13px', color: '#2a2360', fontWeight: '600' }}>the agent does the rest</div></div>
                  </div>
                </div>
              </div>
              <div data-panel="training" hidden={true}>
                <div style={{ position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'panel-in .5s ease both' }}>
                  <div style={{ width: '440px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ fontSize: '12px', letterSpacing: '.14em', color: '#7b83a8', marginBottom: '6px' }}>TRAINING PROGRAM · 2 FORMATS</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ background: '#fff', border: '1px solid #dde4f3', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px', animation: 'row-loop 7s ease infinite', animationDelay: '.1s' }}>
                        <div style={{ fontSize: '11px', letterSpacing: '.12em', color: '#3a4fae' }}>SEMINAR</div>
                        <div style={{ fontSize: '16px', fontWeight: '600' }}>AI for your business, in plain terms</div>
                        <div style={{ fontSize: '13px', color: '#7b83a8' }}>90 min · leadership &amp; teams</div>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}><div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#d3d7e9' }}></div><div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#c0c6dc' }}></div><div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#b5bacf' }}></div><div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#1a1740', color: '#f2f5fb', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+20</div></div>
                      </div>
                      <div style={{ background: '#1a1740', color: '#f2f5fb', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px', animation: 'row-loop 7s ease infinite', animationDelay: '.35s' }}>
                        <div style={{ fontSize: '11px', letterSpacing: '.12em', color: '#3a4fae' }}>HANDS-ON WORKSHOP</div>
                        <div style={{ fontSize: '16px', fontWeight: '600' }}>Build your first automation with us</div>
                        <div style={{ fontSize: '13px', color: '#9499aa' }}>Half day · small groups</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}><span style={{ color: '#3a4fae' }}>✓</span> Connect your tools</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}><span style={{ color: '#3a4fae' }}>✓</span> Write the first agent</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#9499aa' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '1.5px dashed #3a4fae', animation: 'spin 3s linear infinite' }}></div> Ship it to your team</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#d3d7e9', borderRadius: '12px', padding: '16px 18px', marginTop: '6px', animation: 'row-loop 7s ease infinite', animationDelay: '.7s' }}><div style={{ fontSize: '14px', fontWeight: '600' }}>Your team leaves with a working automation</div><div style={{ fontSize: '13px', color: '#2a2360', fontWeight: '600' }}>not just slides</div></div>
                  </div>
                </div>
              </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '22px', fontSize: '15px' }}>
                  <span><strong>Replaces:</strong> <span id="activeReplaces"></span></span>
                  <a href="#contact" style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: 'rgb(176, 138, 74)' }}>Case study↗</span></a>
                </div>
              </div>
            </div>
          </section>

          <ScrollHook eyebrow="AND HOW DOES IT GET BUILT" line="Four steps, so you know what you are agreeing to before you agree to it." />

          <ProcessRail />

          {/* The rail ends on "Build & own", so the ask belongs here rather than
              a thousand pixels further down: step one is the call. */}
          <div className="cta-wrap">
          <div id="ctaBanner" data-reveal="1" style={{ background: '#d3d7e9', borderRadius: '16px', padding: '40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px' }}>
            <div>
              <div style={{ fontSize: '12px', letterSpacing: '.16em', color: '#2a2360', fontWeight: '600', marginBottom: '10px' }}>STEP ONE STARTS HERE</div>
              <h3 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-.02em', margin: '0 0 8px' }}>Book a free 30-minute discovery call</h3>
              <p style={{ fontSize: '15px', color: '#4a4f70', margin: '0', lineHeight: '1.6' }}>No prep, no commitment. Bring one workflow that eats your team's time and leave with a clear plan.</p>
            </div>
            <a href="#contact" style={{ flexShrink: '0', display: 'inline-flex', alignItems: 'center', gap: '12px', background: '#1a1740', color: '#f2f5fb', borderRadius: '999px', padding: '18px 32px', fontSize: '16px', fontWeight: '700', transition: 'transform .2s, background .2s' }} className="hv5">Book a discovery call <span style={{ fontSize: '18px' }}>→</span></a>
          </div>
          </div>

          <ScrollHook eyebrow="AND WHAT DOES IT TAKE TO START" line="Nothing. It connects to the tools you already run." />

          <section id="integration" data-reveal="1" style={{ padding: '0 56px 40px', maxWidth: '1200px', margin: '0 auto', scrollMarginTop: '110px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '28px', marginBottom: '28px' }}>
              <span data-num="1" style={{ fontSize: '120px', fontWeight: '300', lineHeight: '.8', color: '#bcc9e6', fontFamily: 'Georgia,serif', letterSpacing: '-.02em' }}>03</span>
              <span style={{ fontSize: '13px', letterSpacing: '.18em', color: '#1a1740', fontWeight: '600', paddingBottom: '6px' }}>DAY ONE READINESS</span>
            </div>
            <h2 style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '-.02em', lineHeight: '1.15', margin: '0 0 14px', maxWidth: '640px', textWrap: 'pretty' }}>Connected to everything you already run, on day one.</h2>
            <p style={{ fontSize: '17px', color: '#4a4f70', lineHeight: '1.65', margin: '0 0 40px', maxWidth: '560px', textWrap: 'pretty' }}>From the CRM your team lives in down to the model layer underneath, we build into the systems you already operate. Nothing to migrate, no new logins, nothing for your team to learn first &mdash; it works on the day it lands.</p>
            <div id="howGrid" data-stagger="1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '1px', background: '#cdd8ee', border: '1px solid #cdd8ee', maxWidth: '900px', margin: '0 auto' }}>
              <div data-tools-cell="1" style={{ background: '#f2f5fb', padding: '26px 0 30px', transition: 'background .3s', minWidth: '0', overflow: 'hidden' }} className="hv4">
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '26px', padding: '0 28px' }}><span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '12px', color: '#7b83a8' }}>01</span><span style={{ fontSize: '19px', fontWeight: '600', letterSpacing: '-.01em' }}>CRM &amp; revenue</span></div>
                <div data-tools-row="1" style={{ overflow: 'hidden', width: '100%', minWidth: '0', filter: 'grayscale(1)', opacity: '.55', transition: 'filter .4s,opacity .4s', WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)', maskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)' }}>
                  <div data-tools-track="1" style={{ display: 'flex', alignItems: 'center', width: 'max-content', animation: 'toolsMarquee 14s linear infinite' }}><img src="https://cdn.simpleicons.org/hubspot/ff7a59" alt="HubSpot" title="HubSpot" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="/assets/logos/tools/salesforce.svg" alt="Salesforce" title="Salesforce" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '15px', color: '#4a4f70', whiteSpace: 'nowrap', padding: '0 22px' }}>Pipedrive</span><img src="https://cdn.simpleicons.org/zoho/e42527" alt="Zoho" title="Zoho" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/hubspot/ff7a59" alt="HubSpot" title="HubSpot" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="/assets/logos/tools/salesforce.svg" alt="Salesforce" title="Salesforce" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '15px', color: '#4a4f70', whiteSpace: 'nowrap', padding: '0 22px' }}>Pipedrive</span><img src="https://cdn.simpleicons.org/zoho/e42527" alt="Zoho" title="Zoho" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /></div>
                </div>
              </div>
              <div data-tools-cell="1" style={{ background: '#f2f5fb', padding: '26px 0 30px', transition: 'background .3s', minWidth: '0', overflow: 'hidden' }} className="hv4">
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '26px', padding: '0 28px' }}><span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '12px', color: '#7b83a8' }}>02</span><span style={{ fontSize: '19px', fontWeight: '600', letterSpacing: '-.01em' }}>Work &amp; comms</span></div>
                <div data-tools-row="1" style={{ overflow: 'hidden', width: '100%', minWidth: '0', filter: 'grayscale(1)', opacity: '.55', transition: 'filter .4s,opacity .4s', WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)', maskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)' }}>
                  <div data-tools-track="1" style={{ display: 'flex', alignItems: 'center', width: 'max-content', animation: 'toolsMarquee 21s linear infinite' }}><img src="https://cdn.simpleicons.org/notion/111111" alt="Notion" title="Notion" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="/assets/logos/tools/slack-color.svg" alt="Slack" title="Slack" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="/assets/logos/tools/lark-mark.png" alt="Lark" title="Lark" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/googledrive/4285f4" alt="Google Workspace" title="Google Workspace" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/asana/f06a6a" alt="Asana" title="Asana" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/notion/111111" alt="Notion" title="Notion" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="/assets/logos/tools/slack-color.svg" alt="Slack" title="Slack" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="/assets/logos/tools/lark-mark.png" alt="Lark" title="Lark" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/googledrive/4285f4" alt="Google Workspace" title="Google Workspace" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/asana/f06a6a" alt="Asana" title="Asana" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /></div>
                </div>
              </div>
              <div data-tools-cell="1" style={{ background: '#f2f5fb', padding: '26px 0 30px', transition: 'background .3s', minWidth: '0', overflow: 'hidden' }} className="hv4">
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '26px', padding: '0 28px' }}><span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '12px', color: '#7b83a8' }}>03</span><span style={{ fontSize: '19px', fontWeight: '600', letterSpacing: '-.01em' }}>Social &amp; ads</span></div>
                <div data-tools-row="1" style={{ overflow: 'hidden', width: '100%', minWidth: '0', filter: 'grayscale(1)', opacity: '.55', transition: 'filter .4s,opacity .4s', WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)', maskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)' }}>
                  <div data-tools-track="1" style={{ display: 'flex', alignItems: 'center', width: 'max-content', animation: 'toolsMarquee 20s linear infinite' }}><img src="https://cdn.simpleicons.org/instagram/e4405f" alt="Instagram" title="Instagram" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/tiktok/111111" alt="TikTok" title="TikTok" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/googleads/4285f4" alt="Google Ads" title="Google Ads" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/youtube/ff0000" alt="YouTube" title="YouTube" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/instagram/e4405f" alt="Instagram" title="Instagram" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/tiktok/111111" alt="TikTok" title="TikTok" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/googleads/4285f4" alt="Google Ads" title="Google Ads" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/youtube/ff0000" alt="YouTube" title="YouTube" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /></div>
                </div>
              </div>
              <div data-tools-cell="1" style={{ background: '#f2f5fb', padding: '26px 0 30px', transition: 'background .3s', minWidth: '0', overflow: 'hidden' }} className="hv4">
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '26px', padding: '0 28px' }}><span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '12px', color: '#7b83a8' }}>04</span><span style={{ fontSize: '19px', fontWeight: '600', letterSpacing: '-.01em' }}>Data &amp; web</span></div>
                <div data-tools-row="1" style={{ overflow: 'hidden', width: '100%', minWidth: '0', filter: 'grayscale(1)', opacity: '.55', transition: 'filter .4s,opacity .4s', WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)', maskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)' }}>
                  <div data-tools-track="1" style={{ display: 'flex', alignItems: 'center', width: 'max-content', animation: 'toolsMarquee 14s linear infinite' }}><img src="https://cdn.simpleicons.org/postgresql/336791" alt="PostgreSQL" title="PostgreSQL" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/supabase/3ecf8e" alt="Supabase" title="Supabase" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/cloudflare/f38020" alt="Cloudflare" title="Cloudflare" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/shopify/7ab55c" alt="Shopify" title="Shopify" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/postgresql/336791" alt="PostgreSQL" title="PostgreSQL" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/supabase/3ecf8e" alt="Supabase" title="Supabase" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/cloudflare/f38020" alt="Cloudflare" title="Cloudflare" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/shopify/7ab55c" alt="Shopify" title="Shopify" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /></div>
                </div>
              </div>
              <div data-tools-cell="1" style={{ background: '#f2f5fb', padding: '26px 0 30px', transition: 'background .3s', minWidth: '0', overflow: 'hidden' }} className="hv4">
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '26px', padding: '0 28px' }}><span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '12px', color: '#7b83a8' }}>05</span><span style={{ fontSize: '19px', fontWeight: '600', letterSpacing: '-.01em' }}>AI &amp; models</span></div>
                <div data-tools-row="1" style={{ overflow: 'hidden', width: '100%', minWidth: '0', filter: 'grayscale(1)', opacity: '.55', transition: 'filter .4s,opacity .4s', WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)', maskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)' }}>
                  <div data-tools-track="1" style={{ display: 'flex', alignItems: 'center', width: 'max-content', animation: 'toolsMarquee 17s linear infinite' }}><img src="/assets/logos/tools/openai.svg" alt="OpenAI" title="OpenAI" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/claude/d97757" alt="Claude" title="Claude" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/googlegemini/4e8cf7" alt="Gemini" title="Gemini" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '15px', color: '#4a4f70', whiteSpace: 'nowrap', padding: '0 22px' }}>Llama</span><img src="/assets/logos/tools/openai.svg" alt="OpenAI" title="OpenAI" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/claude/d97757" alt="Claude" title="Claude" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/googlegemini/4e8cf7" alt="Gemini" title="Gemini" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '15px', color: '#4a4f70', whiteSpace: 'nowrap', padding: '0 22px' }}>Llama</span></div>
                </div>
              </div>
              <div data-tools-cell="1" style={{ background: '#f2f5fb', padding: '26px 0 30px', transition: 'background .3s', minWidth: '0', overflow: 'hidden' }} className="hv4">
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '26px', padding: '0 28px' }}><span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '12px', color: '#7b83a8' }}>06</span><span style={{ fontSize: '19px', fontWeight: '600', letterSpacing: '-.01em' }}>Automation</span></div>
                <div data-tools-row="1" style={{ overflow: 'hidden', width: '100%', minWidth: '0', filter: 'grayscale(1)', opacity: '.55', transition: 'filter .4s,opacity .4s', WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)', maskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)' }}>
                  <div data-tools-track="1" style={{ display: 'flex', alignItems: 'center', width: 'max-content', animation: 'toolsMarquee 20s linear infinite' }}><img src="https://cdn.simpleicons.org/n8n/ea4b71" alt="n8n" title="n8n" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/zapier/ff4f00" alt="Zapier" title="Zapier" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/make/6d00cc" alt="Make" title="Make" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/n8n/ea4b71" alt="n8n" title="n8n" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/zapier/ff4f00" alt="Zapier" title="Zapier" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /><img src="https://cdn.simpleicons.org/make/6d00cc" alt="Make" title="Make" style={{ width: '24px', height: '24px', display: 'block', margin: '0 22px', flexShrink: '0' }} /></div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginTop: '28px', fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '13px' }}>
              <span style={{ letterSpacing: '.14em', color: '#1a1740' }}>CUSTOM ENGINEERING</span>
              <span style={{ color: '#7b83a8' }}>TypeScript · Python · RAG · Agents · MCP</span>
            </div>
          </section>



        {/* A warmer band than the page it sits on, so the ask reads as a change of
            register rather than another section. */}
        <section id="contact" data-reveal="1" style={{ background: '#d3d7e9', color: '#1a1740', scrollMarginTop: '0', padding: '0 56px' }}>
          <ContactFlow />

          {/* The calendar gets the whole column rather than half of one: Cal
              lays the event, the month and the free times side by side once it
              has the width, and squeezed into the old right-hand card it fell
              back to a single stacked strip.
              home.css targets [data-enquiry] form to collapse the grid at 720px;
              legacy enquiry.js rendered into this wrapper, so keep it. */}
          <div id="bookWrap" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 0 104px' }}>
            <div data-enquiry="1" style={{ background: '#fbfcff', border: '1px solid #c8cde0', borderRadius: '16px', padding: '36px 38px' }}>
              <BookingFlow />
            </div>
          </div>
        </section>

        <footer data-reveal="1" style={{ padding: '0 56px 120px', overflow: 'hidden' }}>
          <div style={{ fontSize: '160px', fontWeight: '700', lineHeight: '1', color: '#dee5f4', letterSpacing: '-.03em', textAlign: 'center', whiteSpace: 'nowrap', userSelect: 'none' }} id="footerMark">VECTIS AI</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', fontSize: '13px', color: '#7b83a8' }}>
            <span>© 2026 Vectis AI</span>
            <div style={{ display: 'flex', gap: '24px' }}><a href="https://linkedin.com/in/steric-tsui" style={{ color: '#7b83a8' }} className="hv1">LinkedIn</a><a href="https://github.com/stericishere" style={{ color: '#7b83a8' }} className="hv1">GitHub</a></div>
          </div>
        </footer>
        </div>
      </div>
      <HomeBehaviors />
    </>
  )
}
