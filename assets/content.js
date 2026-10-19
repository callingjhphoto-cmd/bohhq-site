/* Content for the interactive sections. Sources:
 * - Rooms: 99_FINAL/4_product_reports/opportunity_audit_UNIFIED_SAMPLE_every_section.pdf
 *   (findings 1, 2, 4, 8, 14, 15). Figures copied, not rounded or added. Dates re-set as "3 Aug".
 *   Report wording "till voucher" changed to "manager sign-off" (POS, never till). Staff names left out.
 * - Back office checks, 18 Oct: deck No. 03 Money row (37_supplier: cheapest of your OWN suppliers; 41_accounting: invoice vs PDF).
 * - Steps: 33_client_deck No. 10 (18 Oct), verbatim; 19 Oct plain rebuild: stage "After that" renamed "Run with you" (PROOF_BRIEF §2), "actioned" -> "acted on".
 * - Connect: 33_client_deck No. 09 + REVIEW_2026-10-18.md "Update 16:20" (41_accounting, 42_pos READMEs).
 * - The specialists ledger was removed 18 Oct (deck No. 08 is now the menu slide). Old copy: _prev/2026-10-18_1705/.
 */
window.BOH_CONTENT = {
  rooms: {
    floor: {
      name: "Floor", serial: "No. 01",
      checks: ["Covers, spend per head and discounts, by daypart.", "Add-ons per guest: starters, desserts, second drinks.", "Whether a change you made, like a happy hour, did what you wanted."],
      title: "Spend per head down in early Mon–Fri from 3 Aug",
      lines: [["Covers a week", "180 → 230"], ["Spend per head", "£18.13 → £13.56"], ["Discounts, share of gross", "0.7% → 14.9%"], ["A week, × 52", "£234.41"]],
      amount: "£12,189.28", per: "a year if it continues", conf: "High confidence",
      next: "Keep the promotion and give the team the means to build the bill: a sharing plate at the start of each happy-hour table, and a prompt for a second round."
    },
    kitchen: {
      name: "Kitchen", serial: "No. 02",
      checks: ["Every recipe costed on what you actually pay.", "The price that hits your target GP.", "Every dish ranked on how often it sells and what it earns."],
      title: "Haddock and chips: true GP 57.3%, target 72%",
      lines: [["Menu price, net of VAT", "£13.75"], ["True cost per serve", "£5.87"], ["Cost the target allows", "£3.85"], ["£2.02 over × 420 a month", "£195.44 a week"]],
      amount: "£10,162.65", per: "a year if volume and prices hold", conf: "Low confidence: SAMPLE costing book",
      next: "Price for the target GP on the true cost: £25.50 gross."
    },
    office: {
      name: "Back office", serial: "No. 03",
      checks: ["Supplier prices, line by line, week by week.", "The cheapest of your own suppliers for each product.", "Every invoice checked against the supplier’s own PDF, for keying errors."],
      title: "DairyCo: invoice prices rising",
      lines: [["Lines up since week 5", "4 of 4"], ["Average rise", "13.0%"], ["Cheese, a unit", "£11.00 → £12.37"], ["A week, × 52", "£131.78"]],
      amount: "£6,852.57", per: "a year if it continues", conf: "Medium confidence",
      next: "Talk to DairyCo first: send the price table, ask the reason, and ask for a date they will hold prices."
    },
    bar: {
      name: "Bar", serial: "No. 04",
      checks: ["Each spirit’s usage against what the POS says was poured.", "Cocktails costed with ice, garnish and glass.", "Drinks prices against your target GP."],
      title: "Gin: stock going missing from 13 Jul",
      lines: [["Over what sales say", "15.5%"], ["Normal for this line", "1.2%"], ["Extra over 13 weeks", "34.6 L"], ["A week, × 52", "£58.44"]],
      amount: "£3,038.97", per: "a year if it continues", conf: "Medium confidence",
      next: "Run a measured pour test with every bartender together, ten pours each, no blame. Check jiggers and spouts first."
    },
    walkin: {
      name: "Walk-in", serial: "No. 05",
      checks: ["What was invoiced against what was received.", "Counts against what sales say was used.", "Stock to use before it’s binned, for specials."],
      title: "Invoice bills 40 kg of lamb rump; stock records show 25 received",
      lines: [["Billed", "40 kg"], ["Received", "25 kg"], ["Price a kilo", "£16.80"]],
      amount: "£252.00", per: "found in the documents, recoverable once", conf: "Medium confidence",
      next: "Check the delivery note signed on the day; claim a credit note for the difference."
    },
    pos: {
      name: "POS", serial: "No. 06",
      checks: ["Takings against card and cash payments, every close.", "Refunds and voids against the POS.", "Chargebacks, and whether they were contested."],
      title: "Card refund of £184.00 on 29 Aug has no POS refund record",
      lines: [["Card processor refund, 29 Aug", "£184.00"], ["POS refunds that day", "£0.00"]],
      amount: "£184.00", per: "found in the documents", conf: "High confidence",
      next: "Find who issued the refund and the manager sign-off."
    }
  },
  /* No. 07 marketing, tab 2: REAL 35_marketing planner output (BUILT 17 Oct, 204 tests), SAMPLE venue
   * "The Ninefold Hare": out/gastropub/next_month_calendar.csv, Instagram rows, verbatim (text = caption,
   * shoot = photo note, floor_line = what to tell the table). READY -> waiting, NEEDS_INPUT -> needs. */
  posts: [
    { d: 1, ch: "Instagram", kind: "Event", t: "Sunday roast", cap: "Sunday roast is on every Sunday. Come down and say hello.", photo: "The room set up for sunday roast, empty, with the lights on. No guests in shot unless they have said yes.", floor: "Tell every table about sunday roast (every Sunday).", st: "waiting" },
    { d: 2, ch: "Instagram", kind: "Special", t: "Beef shin & stout suet pudding", cap: "This week's special: beef shin, braised low and slow in the stout we pour at the bar, under a hand-made suet crust. It's here until the shin runs out. £16.50", photo: "Overhead shot on the bar top, pudding turned out, gravy mid-pour. Stout tap soft in the background. Text overlay bottom-left: the dish name. No price on the image.", floor: "Tell them the shin is braised in the stout they can see on the bar, and that chef makes the crust by hand. If they like the stout, suggest a half with it.", st: "waiting" },
    { d: 5, ch: "Instagram", kind: "Seasonal", t: "Bonfire Night", cap: "Bonfire Night at The Ninefold Hare (SAMPLE). Warm food, a table out of the cold, and the fire is inside.", photo: "The room dressed for Bonfire Night in a way that is yours. No stock images.", floor: "Mention Bonfire Night to every table that asks what is on.", st: "waiting" },
    { d: 7, ch: "Instagram", kind: "Special", t: "Roast squash, chicory & Lancashire tart", cap: "Autumn on a plate: squash roasted hard, Lancashire cheese, crisp pastry, bitter chicory to keep it honest. Vegetarian special, while the squash lasts. £15.50", photo: "Single slice on a dark plate, side light from the window, chicory leaves fanned. Text overlay: dish name. No price on the image.", floor: "Lead with taste, not with 'it's the veggie one': sweet squash, salty cheese, bitter leaves. Good with a glass of the white.", st: "waiting" },
    { d: 12, ch: "Instagram", kind: "Team", t: "Who is behind the bar", cap: "Behind the bar this week: [name]. [their words about their favourite thing on the menu]. Ask them about it.", photo: "Them at work, hands in shot, natural light. Ask first; they can say no.", floor: "Nothing to say; the post is the introduction.", st: "needs" },
    { d: 16, ch: "Instagram", kind: "Special", t: "Orchard Spritz (alcohol-free)", cap: "For the driver, the walker, the one who's off it this month: bitter, apple, bubbles, rosemary. Alcohol-free and made like a cocktail. £5.00", photo: "Wine glass on the garden table, condensation, low sun through it. Text overlay: 'Orchard Spritz, alcohol-free'. No price on the image.", floor: "Offer it by name to anyone who orders a soft drink with food. Don't call it a mocktail.", st: "waiting" },
    { d: 21, ch: "Instagram", kind: "Special", t: "Half & Half: stout over best bitter", cap: "The pour that takes a steady hand: best bitter below, stout floated on top. Ask at the bar and watch it layer. £6.50", photo: "Side-on glass against a plain wall, layers sharp, a hand still holding the spoon. Text overlay: 'Half & Half'. No price on the image.", floor: "Pour it in front of them; that's the sell. If they drink stout, this is the way in to the cask.", st: "waiting" },
    { d: 26, ch: "Instagram", kind: "Team", t: "Who is behind the bar", cap: "Behind the bar this week: [name]. [their words about their favourite thing on the menu]. Ask them about it.", photo: "Them at work, hands in shot, natural light. Ask first; they can say no.", floor: "Nothing to say; the post is the introduction.", st: "needs" },
    { d: 30, ch: "Instagram", kind: "Special", t: "Sirloin steak", cap: "This week Sirloin steak is at the front of the board. £27.00. Ask the team what goes well with it.", photo: "Natural light, the plate on its own, one hand in shot. No price on the image.", floor: "Tell the table the story of the Sirloin steak: where it comes from and why the kitchen likes it.", st: "waiting" }
  ],
  /* No. 08 connect. Rows and wording: deck No. 09. Vendor notes: REVIEW_2026-10-18 (Sage no per-site split;
   * Square and Epos Now no line voids, Square no covers; QuickBooks has no read-only scope, so the promise rests on our guard).
   * Catches: 41_accounting fixtures/world_truth.json K1 (£25.40 keyed vs £24.50 PDF, qty 6: £5.40 + £1.08 VAT = £6.48);
   * 42_pos out/copper_hare/summary.json cost_gt_price (staff-meal lines). */
  connect: [
    { id: "acc", head: "Your accounts software", zone: "office", kind: "link",
      reads: ["P&L by month, and by site where your accounts split it", "Supplier bills, with the supplier’s own PDFs", "Bank lines", "VAT and tax dates", "Payroll totals, once the data agreement is signed"],
      catchText: "One supplier invoice keyed at £25.40 a bottle where the supplier’s PDF said £24.50, so £6.48 overpaid. Found by checking every invoice PDF against what was keyed in.",
      systems: [ { n: "Xero" }, { n: "QuickBooks", note: "QuickBooks has no read-only setting of its own, so the promise rests on our software, which refuses any change." }, { n: "Sage", note: "Sage has no per-site split, so the P&L comes by month only." }, { n: "FreeAgent", note: "Built on FreeAgent’s published format: bills, invoices, bank, VAT returns and the P&L, checked against its own trial balance. No per-site split and no bill PDFs yet." } ] },
    { id: "pos", head: "Your POS", zone: "pos", kind: "link",
      reads: ["Sales item by item", "Discounts and refunds", "Tips and staff shifts", "Voids and covers, where your POS records them"],
      catchText: "Staff-meal dishes rung through below their cost.",
      systems: [ { n: "Square", note: "Square records no line voids and no covers." }, { n: "Toast" }, { n: "Epos Now", note: "Epos Now records no line voids." }, { n: "SumUp" } ] },
    { id: "card", head: "Your card payments", zone: "office", kind: "link",
      reads: ["Payouts, fees and chargebacks", "Matched to your POS and your bank"],
      catchText: "A card payout that never reached the bank. Found by matching each payout from the processor to the bank lines.",
      systems: [ { n: "Stripe" }, { n: "Square" }, { n: "SumUp" } ] },
    { id: "mail", head: "A POS with no open link", zone: "pos", kind: "email",
      reads: ["Its standard daily report, by email from its own back office", "Set up against your first real report"],
      systems: [ { n: "Lightspeed" }, { n: "Zonal" }, { n: "Tevalis" }, { n: "TouchBistro" } ] },
    { id: "photo", head: "Paper that never reaches your accounts", zone: null, kind: "photo",
      reads: ["A photo, as the last resort"],
      systems: [ { n: "A photo" } ] }
  ],
  steps: [
    { n: 1, stage: "The audit", t: "First call", you: "Tell us which operating systems you run (POS, rota, booking, accounts). Sign the data agreement.", us: "Send a one-page list of what to download." },
    { n: 2, stage: "The audit", t: "Your files", you: "Connect your POS and accounts once, or send 16 weeks of downloads. ‡", us: "Test-load one file first." },
    { n: 3, stage: "The audit", t: "Audit visit", you: "An hour or two, on a laptop in your office. †", us: "Load your files there. Nothing leaves your office." },
    { n: 4, stage: "The audit", t: "The report", you: "Mark each finding right or wrong, or say you knew.", us: "Walk you through it, biggest pounds first.", call: "your call: go on?" },
    { n: 5, stage: "30-day trial", t: "The trial", you: "Write down your target, then run service as normal.", us: "Suggestions and a weekly note. Nothing is acted on." },
    { n: 6, stage: "30-day trial", t: "Day 30", you: "Target hit? Carry on. Missed? Stop and keep the reports.", us: "The trial report, against your target.", call: "your call: target hit?" },
    { n: 7, stage: "Run with you", t: "Running", you: "Approve or say no to each suggestion.", us: "A weekly note and a monthly review." }
  ]
};
