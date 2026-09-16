# 7. The numbers band is published research, and says so on its face

Date: 2026-09-16

## Status

Accepted. Applies and tightens the content boundaries of
[ADR-0001](0001-problem-ring.md) — no client logos, no fabricated testimonials, no
unverified outcome metrics — for the one section on the site whose whole job is to
show numbers.

## Context

The client asked for a framing along the lines of "utilize AI to get a measurable
business result", pointing at two reference sites: airev.us, and a near-black band of
three large statistics laid out on a hairline grid with each figure's source cited
underneath and a footer reading "PUBLISHED RESEARCH — NOT CLIENT RESULTS".

That footer is the interesting part of the reference. A statistics band is the highest
risk content type a consultancy can put on a homepage, because the same layout shows
"our clients saw 40%" and "researchers measured 40%" identically, and a reader cannot
tell which they are looking at unless the page tells them. Vectis has no published
client outcomes it can stand behind, and ADR-0001 already rules out inventing them.

## Decision

**The band exists, and every number on it is published research with its source one
click away.**

Three figures, chosen because each one stands under a different part of what the story
has just claimed:

| | Figure | Claim | Source |
|---|---|---|---|
| 001 | 6 hrs | a week or more is what 59% of workers say they would get back if their repetitive tasks were automated | Smartsheet, *Automation in the Workplace* (2017) |
| 002 | 7× | more likely to qualify a lead when you reach it inside the hour; nearly a quarter of firms never reply at all | Harvard Business Review, *The Short Life of Online Sales Leads* (Oldroyd, McElheran & Elkington, 2011) |
| 003 | 95% | of enterprise generative-AI pilots return nothing measurable; the gap is integration and training, not the models | MIT Project NANDA, *The GenAI Divide: State of AI in Business* (2025) |

**Three rules hold for anything that ever appears in this band.** Each figure links to
its source. Each cell is labelled `Measured`. The footer says, in words, *published
research — not client results*. A number that cannot satisfy all three does not go here
— it goes in a case study with a named client who has agreed to it, or nowhere.

The third figure is the one the section is really for. It says most AI projects fail,
and that the reason is integration and training rather than the models — which is the
argument for a firm that turns an existing SOP into an agent with approval gates and
trains the team on it, rather than handing over a tool. It earns the services section
that follows.

## Consequences

The band sits between act three and the clients strip: the story ends on the machine,
the numbers say why that machine is worth having, and `#services` then says what we
actually build. It is one screen on a page the client has already called too long, and
that cost is accepted because it is the only place on the site that offers evidence
rather than assertion.

It is the first dark section on a light page. That contrast is deliberate and is what
makes it read as a citation block rather than as more marketing.

Any later edit that adds a Vectis outcome to this band breaks ADR-0001, whatever the
number is and however true it is, unless it comes with a named, consenting client.

## Alternatives rejected

**Inventing plausible figures.** The obvious failure mode and the reason this record
exists. Nothing on this band was written before its source was found.

**Reusing the reference's three statistics.** The Smartsheet study is the most-cited
work in this area and convergence on it is natural, but taking the same three figures
with the same labels is taking someone's section. 001 uses the saving from that report
rather than the waste, which is also the more outcome-shaped number and therefore the
better fit for what was asked for.

**Client results instead of research.** There are none that a client has agreed to
publish. When there are, they belong in a case study with the client named, not in an
anonymous statistic.
