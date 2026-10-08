'use client';
// Single site footer — the Home design's footer, used by every page (views and old components).
import React, { Fragment } from 'react';
import { $A, $i, $list } from '@/dc/runtime';

const R = React.createElement;
const icon = (paths, extra) =>
  R('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', ...(extra || {}) },
    ...paths.map((d, i) => (typeof d === 'string' ? R('path', { key: i, d }) : R(d.t, { key: i, ...d.a }))));
const iconMaple = icon(['M12 3l1.8 3.5 3.2-1-1 3.5 3.5 1.5-3 2.5 2 3-4-.5-.5 3.5-2-2.5-2 2.5-.5-3.5-4 .5 2-3-3-2.5 3.5-1.5-1-3.5 3.2 1z'], { width: 18, height: 18, strokeWidth: 1.4 });
const iconPhoneTop = icon(['M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z'], { width: 16, height: 16, strokeWidth: 2 });
const B = '/';
    const L = (arr) =>
  arr.map((s) => {
    const [label, p] = s.split('|');
    return { label, href: B + p + '/' };
  });
const footerCols = [
  {
    title: 'Types of Services',
    links: L([
      'Detox Centres in Canada|detox-centres-in-canada',
      'Drug Rehabilitation in Canada|drug-rehabilitation-in-canada',
      '12 Step Program for Drug Rehab & Alcohol Treatment|12-steps-programs',
      'Home Detox in Canada|home-detox-in-canada',
      'Long Term Drug Rehab Canada|long-term-drug-rehab-canada',
      'Medical Detox in Canada|medical-detox-in-canada',
      'Outpatient Drug Rehab Centers|outpatient-drug-rehab-centers',
      'Residential Drug Rehabs in Canada|residential-drug-rehabs-in-canada',
      'Short Term Drug Rehab in Canada|short-term-drug-rehab-in-canada',
      'Substance Abuse & Addiction|substance-abuse-addiction',
      '30 Days Treatment by Canadian Provinces|30-days-treatment-by-canadian-provinces',
    ]),
  },
  {
    title: 'Special Services',
    links: L([
      'Adolescent Drug Rehab|adolescent-drug-rehab-center',
      'Christian Faith-Based Rehabs in Canada|christian-faith-based-rehabs-in-canada',
      'Drug & Alcohol Assessments in Canada|drug-alcohol-assessments-in-canada',
      'Raam Clinic|raam-clinic',
      'Drugs and Alcohol Intervention|drugs-and-alcohol-intervention',
      'First Nation Drug & Alcohol Rehab|first-nation-drug-alcohol-rehabs',
      'Holistic Services in Canada|holistic-services-in-canada',
      'Men Only Drug Rehabs in Canada|men-only-drug-rehabs-in-canada',
      'Pregnant Women Services in Canada|pregnant-women-addiction-services-in-canada',
      'Women Only Rehab Centres in Canada|women-only-rehab-centers-in-canada',
    ]),
  },
  {
    title: 'Other Services',
    links: L([
      'AA Support Group|aa-support-group',
      'Drug Support Groups in Canada|drug-support-groups-in-canada',
      'DUI in Canada|dui-in-canada',
      'DUI Lawyers in Canada|dui-lawyers-in-canada',
      'Prevention & Education Programs|prevention-education-programs',
      'Shelter Services in Canada|shelter-services-in-canada',
    ]),
  },
];

export const css =
  '@keyframes topCallRing{0%{transform:scale(1);opacity:.55}70%,100%{transform:scale(1.7);opacity:0}}' +
  '@media (prefers-reduced-motion:reduce){[style*="topCallRing"]{animation:none!important}}' +
  '.sf-grid{grid-template-columns:minmax(0,1.25fr) repeat(3,minmax(0,1fr))}' +
  '@media(max-width:999px){.sf-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}' +
  '@media(max-width:679px){.sf-grid{grid-template-columns:minmax(0,1fr)}}';

export default function SiteFooter() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="rc-page" style={{ background: '#fff', paddingTop: '24px', marginTop: 'auto' }}>
          <footer
            data-screen-label="Footer"
            style={{
              position: 'relative',
              overflow: 'hidden',
              background:
                'radial-gradient(700px 360px at 0% 0%,rgba(8,144,232,.22),rgba(8,144,232,0) 65%),radial-gradient(520px 320px at 100% 100%,rgba(216,32,40,.10),rgba(216,32,40,0) 65%),#10233a',
              color: '#b7c7d8',
              borderRadius: '40px 40px 0 0',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '0',
                backgroundImage: 'radial-gradient(rgba(255,255,255,.06) 1px,transparent 1.2px)',
                backgroundSize: '24px 24px',
                WebkitMaskImage: 'radial-gradient(60% 70% at 100% 0%,#000,transparent)',
                maskImage: 'radial-gradient(60% 70% at 100% 0%,#000,transparent)',
                pointerEvents: 'none',
              }}
            />
            <div
              className="sf-grid" style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: '72px 32px 40px', display: 'grid', gap: '48px 40px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', minWidth: '0' }}>
                <$A href="/" style={{ alignSelf: 'flex-start', display: 'block' }}>
                  <img
                    src="/assets/logo-white.png"
                    alt="Addiction Rehab Centres Canada"
                    style={{ height: '58px', width: 'auto', display: 'block' }}
                  />
                </$A>
                <p
                  style={{
                    fontSize: '15px',
                    lineHeight: '1.6',
                    color: '#b7c7d8',
                    margin: '0',
                    maxWidth: '320px',
                    textWrap: 'pretty',
                  }}
                >
                  We Are Available 24/7. Free, confidential help finding the right treatment in Canada.
                </p>
                <$A
                  className="scpz scpg"
                  href="tel:+1-855-885-4747"
                  style={{
                    alignSelf: 'flex-start',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 20px 8px 8px',
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,.06)',
                    border: '1px solid rgba(255,255,255,.12)',
                    color: '#fff',
                    transition: 'background .18s ease,border-color .18s ease,transform .12s ease-out',
                  }}
                >
                  <span
                    style={{
                      position: 'relative',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#D82028',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: '0',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        inset: '0',
                        borderRadius: '50%',
                        border: '2px solid #D82028',
                        animation: 'topCallRing 2.8s cubic-bezier(.23,1,.32,1) infinite',
                      }}
                    />
                    {$i(iconPhoneTop)}
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <span style={{ font: '500 12px Figtree,sans-serif', color: '#9fb3c8' }}>Call us, day or night</span>
                    <span style={{ font: '600 17px Jost,sans-serif', letterSpacing: '.01em' }}>+1-855-885-4747</span>
                  </span>
                </$A>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <$A
                    className="scpd scp10"
                    href="https://www.facebook.com/Addiction-Rehab-Centres-Canada-772760289732512/"
                    rel="nofollow external noopener noreferrer"
                    aria-label="Facebook"
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,.06)',
                      border: '1px solid rgba(255,255,255,.12)',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#fff',
                      transition: 'background .18s ease,border-color .18s ease,transform .12s ease-out',
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path
                        d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21z"
                        style={{ fill: 'currentColor' }}
                      />
                    </svg>
                  </$A>
                </div>
              </div>
              {$list(footerCols).map((col, $index) => (
                <Fragment key={$index}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '0' }}>
                    <h4
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        font: '600 12px Figtree,sans-serif',
                        letterSpacing: '.14em',
                        textTransform: 'uppercase',
                        color: '#fff',
                        margin: '0',
                      }}
                    >
                      <span style={{ width: '18px', height: '2px', borderRadius: '2px', background: '#0890E8' }} />
                      {$i(col?.title)}
                    </h4>
                    <ul
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        listStyle: 'none',
                        margin: '0',
                        padding: '0',
                      }}
                    >
                      {$list(col?.links).map((l, $index) => (
                        <Fragment key={$index}>
                          <li>
                            <$A
                              className="scp11"
                              href={l?.href}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '5px 0',
                                fontSize: '14.5px',
                                color: '#b7c7d8',
                                lineHeight: '1.4',
                                transition: 'color .15s ease,transform .2s cubic-bezier(.23,1,.32,1)',
                              }}
                            >
                              {$i(l?.label)}
                            </$A>
                          </li>
                        </Fragment>
                      ))}
                    </ul>
                  </div>
                </Fragment>
              ))}
            </div>
            <div
              style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}
              data-rc-wrap="1"
            >
              <div
                style={{
                  borderTop: '1px solid rgba(255,255,255,.1)',
                  padding: '22px 0 26px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '14px 24px',
                  fontSize: '13.5px',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  {$i(iconMaple)}© 2025 Addiction Rehab Centres Canada
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <$A
                    className="scp12"
                    href="/privacy-policy"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '999px',
                      color: '#b7c7d8',
                      transition: 'background .15s ease,color .15s ease',
                    }}
                  >
                    Privacy Policy
                  </$A>
                  <$A
                    className="scp12"
                    href="/terms-of-use"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '999px',
                      color: '#b7c7d8',
                      transition: 'background .15s ease,color .15s ease',
                    }}
                  >
                    Terms of Use
                  </$A>
                  <$A
                    className="scp12"
                    href="/promote"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '999px',
                      color: '#b7c7d8',
                      transition: 'background .15s ease,color .15s ease',
                    }}
                  >
                    Promote Your Centre
                  </$A>
                  <$A
                    className="scp12"
                    href="https://addictionrehabcenters.ca/llms.txt"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '999px',
                      color: '#b7c7d8',
                      transition: 'background .15s ease,color .15s ease',
                    }}
                  >
                    Hey Ai, Learn About Us
                  </$A>
                </div>
              </div>
            </div>
          </footer>
        </div>
    </>
  );
}
