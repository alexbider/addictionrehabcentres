#!/bin/sh
# Re-runs the design comparison for every rebuilt page (server must be running: npm run dev -- -p 3217, or npm run build && npm start -- -p 3217).
cd "$(dirname "$0")/../.."
node audit/scripts/compare-design.mjs --design Promote --sample /promote-design/ --real /promote/ --name promote
node audit/scripts/compare-design.mjs --design Centre --sample /centre/ --real /canadian-centre-for-addictions/,/village-of-hope/,/niwichihaw-aboriginal-addiction-counselling-service/,/1000-islands-addiction-rehab/,/inspire-change-wellness-center/ --name centre --skip "SiteHeader,Footer,Team" --changed "Reviews,Centre Hero" --allow-extra "Claim this listing" --skip-grid "Centre Hero,Sponsored Centres,About"
node audit/scripts/compare-design.mjs --design City --sample /city/ --real /7-best-drug-alcohol-rehab-centres-in-vancouver-2025/,/toronto-rehabs/,/listing-location/vancouver/,/listing-location/london/,/listing-location/truro/ --name city --skip-grid "City Hero,Ranked list,Nearby,Guide,Compare,How we ranked"
node audit/scripts/compare-design.mjs --design Province --allow-extra "Related links" --sample /province/ --real /alberta-rehabs/,/ontario-rehabs/,/northwest-territories-rehabs/,/manitoba-rehabs/ --name province --skip-grid "Province Hero,Listings,Cities,Guide,Other Provinces,Why trust us"
node audit/scripts/compare-design.mjs --design Drug --allow-extra "Related links" --sample /drug/ --real /benzodiazepine-addiction/,/heroin-addiction/,/marijuana-addiction/,/oxycodone-addiction/,/drug-alcohol-rehabs-in-quebec/ --name drug --skip-grid "Drug Hero,Effects,Let Us Help You,Other Drugs,Sponsored Centres"
node audit/scripts/compare-design.mjs --design Intervention --allow-extra "Related links" --sample /intervention/ --real /detox-centres-in-canada/,/drugs-and-alcohol-intervention/,/medical-detox-in-canada/,/aa-support-group/ --name intervention --skip-grid "Hero,Article,Provinces,Let us help,Call strip"
node audit/scripts/compare-design.mjs --design ClaimListing --sample /claim-design/ --real /claim-listing/ --name claim
node audit/scripts/compare-design.mjs --design CentreOnboarding --sample /centre-onboarding/ --name onboarding
node audit/scripts/compare-header-footer.mjs
