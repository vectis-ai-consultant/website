---
title: Turn one ad that works into fifteen you can ship
slug: poster-ad-batch
date: 2026-09-07
resource: Poster ad batch maker
readingTime: 7
author: Steric Tsui
excerpt: A creative pipeline that takes ad formats which already converted, crosses them against your product, and hands you a contact sheet to pick from. The only human job left is choosing.
---

> **In short:** One ad that already works becomes fifteen you can ship in an
> afternoon. Each proven ad is read once into a set of named levers, crossed against
> your product, and turned into a ready-to-paste prompt for every variant. You
> generate them, tick the keepers on a contact sheet, and keep those. The only human
> job left is choosing.

**Key takeaways**

- Small teams rarely have a creative problem. They have a volume problem: one ad
  works, and producing the next ten costs a designer a week.
- A reference ad is digested into named levers — where the product sits, what the
  headline does, which parts are fixed and which are free to vary. Generation runs
  against that description, not against the picture.
- Adherence is the knob worth understanding. High reproduces the layout and moves
  only product, palette and copy; low keeps only the core idea. Start high and
  loosen it, never the other way round.
- Save the generated images in order. The contact sheet matches by save time, so
  skipping around silently mismatches images to prompts.
- An afternoon ends with fifteen variants on a contact sheet, the ones you ticked
  copied out ready to run, and a digest per template you keep and reuse on the next
  product.

<!--gate-->

Most small teams do not have a creative problem. They have a **volume** problem. One
ad works, nobody knows quite why, and it gets run into the ground because producing
the next ten costs a designer a week.

This resource is the pipeline we use to close that gap. It takes a folder of ad
formats that already performed, crosses each one against your product, and writes a
ready-to-paste prompt for every variant. You generate them, tick the ones you like on
a contact sheet, and keep those.

## What it actually does

<figure class="flow">
<ol>
<li><b>Proven ad formats</b><span>Screenshots of ads that already worked for someone.</span></li>
<li data-join="&times;"><b>Your product</b><span>A short description and one hero photo.</span></li>
<li data-join="&rarr;"><b>A prompt per variant</b><span>Written for you, grouped and ready to paste.</span></li>
<li data-join="&rarr;"><b>A contact sheet</b><span>Generate, then tick the ones worth running.</span></li>
</ol>
<figcaption>Each ad format is read once into a digest &mdash; the levers that make the layout work, and which of them stay fixed while the rest vary.</figcaption>
</figure>

Three ideas do the work.

**A template is digested into levers, not copied.** Before anything is generated, each
reference ad is read once and turned into a small JSON file naming what makes that
layout work — where the product sits, what the headline does, which parts are fixed
and which are free to vary. Generation runs against that description, not against the
picture. This is the step that decides whether a batch comes back coherent or
scattered.

**Variants come from crossing pools.** Warm and cool, indoor and outdoor, and so on.
Five per template by default, so there is always a real choice rather than one option
and a shrug.

**Every prompt is saved verbatim.** When a batch comes back wrong you can read exactly
what was asked for. A creative pipeline you cannot debug is one you stop trusting on
the second bad run.

## Setting it up

The workspace is three folders:

<figure class="rows">
<p><b>poster-ads/</b></p>
<ul>
<li><i>templates/</i><span>The ad screenshots you dropped in</span></li>
<li><i>products/&lt;slug&gt;/</i><span>One file describing the product, and its images</span></li>
<li><i>output/&lt;title&gt;-&lt;date&gt;/</i><span>Everything a batch produces</span></li>
</ul>
</figure>

Your product is one short file. Six things, written once:

<figure class="rows">
<ul>
<li><i>name</i><span>Cloud Socks</span></li>
<li><i>hero</i><span>One photo of the product, flat and well lit</span></li>
<li><i>value props</i><span>Feels like a cloud &middot; Lightweight warmth &middot; Helps you wind down</span></li>
<li><i>avoid</i><span>No visible seams; never show the sole</span></li>
<li><i>description</i><span>Merino wool sleep socks. Sold to people who run cold at night.</span></li>
</ul>
</figure>

The hero photo is the one worth care. **Use a flat, unrolled, well-lit shot.** The model
can only hold folds, curves and texture it can actually see — a rolled-up product
photo is the single most common cause of the product drifting between variants.

## Running a batch

Four steps, and only one of them takes any thought.

<figure class="steps">
<ol>
<li><b>Check the templates</b><span>Every file is hashed, and anything new or changed since it was last digested is flagged &mdash; so you never generate against a layout that no longer exists.</span></li>
<li><b>Digest what was flagged</b><span>Each new reference ad is read once, turned into its levers, and stamped.</span></li>
<li><b>Plan the batch</b><span>Five fields: a title, the product, the angle in one line, how closely to follow the reference, and how many per template.</span></li>
<li><b>Bring the images back</b><span>Each one is matched to the prompt that made it and laid out on a contact sheet to pick from.</span></li>
</ol>
</figure>

**Adherence is the knob worth understanding.** Set it high and the layout is reproduced,
with only product, palette and copy moving. Set it low and only the core idea survives.
Start high.
If the batch comes back samey, loosen it — that is the correct order, because a loose
first batch tells you nothing about whether the format transfers.

You now have a paste pack, grouped one chat per template. Attach the two images once
at the top, then send that template's prompts one at a time.

> Save each result to your downloads folder **in order**. The next step matches by
> save time, so skipping around silently mismatches images to prompts. This is the one
> place the manual loop goes wrong.

Bringing them back only fills variants that have no image yet, so you can do half a
batch now and the rest tomorrow. The id-to-filename mapping is printed as it goes —
read it once and confirm it looks right.

## What you'll have at the end of an afternoon

- **Fifteen variants on a contact sheet**, and the ones you ticked copied into
  a selected folder, named and ready to run.
- **A digest per template that you keep.** The expensive step is describing a layout
  properly, and you only do it once — the next batch and the one after reuse it.
- **Every prompt saved verbatim**, so if a batch comes back wrong you can see exactly
  what was asked for rather than guessing.
- **An honest read on whether your templates are worth batching at all.** If the
  variants come back flat, that is information: the format did not transfer, and you
  learned it for the cost of one afternoon instead of one quarter.

That last one matters most. You leave knowing either that you have a repeatable
creative pipeline, or that the formats you were about to build one on do not hold up.

## Where this helps, and where it does not

**It widens exactly one bottleneck: creative production.** If what is actually
limiting you is ideas, or distribution, more ad variants change nothing. Check that
before running a batch.

**The templates folder is the ceiling.** Fill it with your own high-performing ads and
you are spinning formats that already converted for you. Fill it with ads scraped from
strangers and you are copying a look, not a result — the output can only be as good as
what went in, and it is worth being honest with yourself about which one you did.

**Check the outputs for bleed-through.** The prompts forbid reproducing the reference
brand, but verify it. A reference wordmark surviving into your ad is a legal problem,
not a taste problem.

**Text is the weakest layer.** If headlines keep coming back mangled, that is the
signal to composite the text separately — not to keep adding prompt rules.

One last thing worth saying plainly: the generation step is a person in a chat window.
That is deliberate. It costs nothing per image and needs no API key, and it keeps a
human eye on every batch. Automating it is a money-and-quality trade you should only
make once the manual version has proved the templates are worth batching at all.
