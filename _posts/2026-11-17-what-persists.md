---
layout: post
title: "Search for the Simplest Explaination of Intelligence: Open Questions in Evolution and Learning"
date: 2026-11-17 00:00:00+0530
description: "Open Questions in Evolution and Learning"
tags:
  - evolution
  - intelligence
  - information theory
  - open-endedness
related_posts: false
giscus_comments: true
read_time: 30
---

<style>
.post:has(.essay) > .post-header{display:none}
.essay h1{font-size:2.6rem;font-weight:700;letter-spacing:-.02em;line-height:1.15;margin:0 0 .45rem}
.essay h2{font-size:1.75rem;font-weight:700;letter-spacing:-.015em;line-height:1.25;margin:2.8rem 0 .85rem}
.essay h3{font-size:1.15rem;font-weight:700;letter-spacing:0;line-height:1.35}
.essay .hero-meta{font-size:.92rem;line-height:1.5;color:var(--global-text-color-light);margin:0 0 .3rem}
.essay .hero-meta:last-child{margin-bottom:1.3rem}
.essay .hero-meta a{color:inherit;text-decoration:none}
.essay .hero-meta a:hover{text-decoration:underline}
.essay a{color:#2698ba;text-underline-offset:3px}
.essay a:hover{color:var(--global-theme-color)}
.essay .equation{margin:1.1rem 0 1.4rem;text-align:center;overflow-x:auto}
@media (max-width:650px){
  .essay h1{font-size:2.15rem}
  .essay h2{font-size:1.55rem}
}
</style>

<div class="essay" markdown="1">

# Search for the Simplest Explaination of Intelligence: Open Questions in Evolution and Learning

{% if page.read_time %}
{% assign read_time = page.read_time %}
{% else %}
{% assign read_time = page.content | number_of_words | divided_by: 180 | plus: 1 %}
{% endif %}
{% assign year = page.date | date: "%Y" %}
{% assign tags = page.tags | join: "" %}
{% assign categories = page.categories | join: "" %}
<p class="hero-meta">{{ read_time }} min read &nbsp; &middot; &nbsp; {{ page.date | date: '%B %d, %Y' }}</p>
<p class="hero-meta">
<a href="{{ year | prepend: '/blog/' | relative_url }}"><i class="fa-solid fa-calendar fa-sm"></i> {{ year }}</a>
{% if tags != "" %}
&nbsp; &middot; &nbsp;
{% for tag in page.tags %}
<a href="{{ tag | slugify | prepend: '/blog/tag/' | relative_url }}"><i class="fa-solid fa-hashtag fa-sm"></i> {{ tag }}</a>
{% unless forloop.last %}&nbsp;{% endunless %}
{% endfor %}
{% endif %}
{% if categories != "" %}
&nbsp; &middot; &nbsp;
{% for category in page.categories %}
<a href="{{ category | slugify | prepend: '/blog/category/' | relative_url }}"><i class="fa-solid fa-tag fa-sm"></i> {{ category }}</a>
{% unless forloop.last %}&nbsp;{% endunless %}
{% endfor %}
{% endif %}
</p>

## Why these questions now

Much of AI is now organised around one goal, recursive self-improvement  a system whose gains make it better at producing its next gains ([Good, 1965](https://doi.org/10.1016/S0065-2458(08)60418-0); [Schmidhuber, 2003](https://arxiv.org/abs/cs/0309048)). Parts of that loop are already closed. Claude now writes more than 80% of the code merged into Anthropic's codebase ([Anthropic, 2026](https://www.anthropic.com/institute/recursive-self-improvement)); AlphaEvolve, an evolutionary coding agent built on Gemini, found a kernel that cut Gemini's own training time by about 1% ([Novikov et al., 2025](https://arxiv.org/abs/2506.13131)); and the Darwin Gödel Machine rewrites its own agent code, keeping an archive of past variants to build on ([Zhang et al., 2026](https://arxiv.org/abs/2505.22954)). The rest of the field supplies the levers. Pre-training is running into the Data Wall as high-quality public text runs out, so data selection now decides which tokens shape the model at each step ([Wang et al., 2026](https://arxiv.org/abs/2602.05400)). Looped models decouple compute depth from parameter count by reusing the same weights ([Zhu et al., 2025](https://arxiv.org/abs/2510.25741)). Zeroth-order methods such as Dust train transformers by adding noise to per-token activations instead of using backpropagation ([Dahal et al., 2026](https://github.com/qlabs-eng/dust)). and self-improving harnesses rewrite their own prompts, skills, memory and sub-agents ([Jaghouar et al., 2026](https://arxiv.org/abs/2608.23552)). Scaling has also gone wide: Kimi's Agent Swarm has one orchestrator direct up to 300 sub-agents in an organisation it designs itself ([Kimi Team, 2026](https://www.kimi.ai/help/agent/agent-swarm)), and populations of language-model agents settle on shared conventions and collective biases that no single agent holds ([Ashery et al., 2025](https://doi.org/10.1126/sciadv.adu9368)). Yet a survey of 1,250 recent papers finds that bounded self-refinement is routine while open-ended self-improvement stays limited by grounding, collapse and compute, and that deciding what deserves evaluation at all remains unsolved ([Chen et al., 2026](https://arxiv.org/abs/2607.07663)); Each lever frees one part of the learner while the architecture, the objective, the representations and the judge of success stay designed by us. One process has already improved its own capacity to improve with no designer: evolution, development and learning, which over nested timescales produced learners, then better learners, then us. Understanding the principles behind that process, rather than copying it, is the aim. A universal theory of learning, one that explains how learners and their capacity to learn arise and grow, may be one of the greatest scientific challenges we face.

This essay maps the open questions such a theory must answer. It asks six plain questions in order: what is simple, what lasts, how it lasts, with whom, how it gets better at lasting, and for whom. The last answer returns to the first, so the essay is itself a loop. Each section ends with its open questions.

*[Figure: the essay as a loop · six questions]*

Learning is where the earlier threads converge, and the observer's inherited machine is the prior the essay starts from.

## 1. Priors: what counts as simple?

Before any learner exists, the world already makes some outcomes likely and others costly, and every learner inherits that bias before adding its own. A prior, here, is anything that makes some possibilities more probable than others before experience arrives.

**The world's own prior.** Physics fixes what is cheap: low-energy states, local interactions, symmetric configurations, paths of least action. None of this needs a computer to define it. A falling stone does not search over programs; the laws of motion have already decided what is easy for it.

**Simplicity relative to a machine.** In algorithmic information theory, the complexity of an object is the length of its shortest description on a universal machine, one that can simulate any other. Two universal machines disagree by at most a constant, which is why the choice is said to wash out. For a finite learner the constant need not wash out: it can exceed everything the learner will ever observe ([Sterkenburg, 2026](https://arxiv.org/abs/2603.20274)), and a badly chosen machine can make even an ideal agent behave arbitrarily badly ([Leike and Hutter, 2015](https://arxiv.org/abs/1510.04931)).

**Physical and algorithmic simplicity meet, and part.** They meet in thermodynamics: erasing a record costs heat in proportion to its compressed size ([Zurek, 1989](https://doi.org/10.1103/PhysRevA.40.4731)), and the heat a computer must give off to produce an output depends on that output's algorithmic complexity ([Kolchinsky and Wolpert, 2020](https://doi.org/10.1103/PhysRevResearch.2.033312)). They part elsewhere. A gas at equilibrium is physically simple but its microstate is algorithmically random; a spin glass's lowest-energy state can be algorithmically complex; and a short program can take enormous time to run, which is Bennett's logical depth. Müller turns the relation around and derives the appearance of simple physical laws from Solomonoff induction over an observer's experiences ([Müller, 2020](https://arxiv.org/abs/1712.01826)).

**Inheritance makes simplicity historical.** In evolution, the genotype–phenotype map plays the role of the machine. Mutations are random in genotype space, but development decides which phenotypes they produce, so some phenotypes are short to reach and others long. Many input–output maps, genotype–phenotype maps among them, are strongly biased toward simple outputs ([Dingle et al., 2018](https://doi.org/10.1038/s41467-018-03101-6)):

<div class="equation">
$$
P(x) \lesssim 2^{-a\tilde{K}(x) - b}
$$
</div>

Here P(x) is the probability that a random input produces output x, K̃(x) is an estimate of the output's complexity, and a and b depend on the map. Symmetric protein complexes and RNA shapes are overrepresented in nature for exactly this reason, before selection acts ([Johnston et al., 2022](https://doi.org/10.1073/pnas.2113883119)). Learners inherit priors the same way: genomes are far too small to specify brain wiring, so what passes between generations must be a compressed inductive bias, not knowledge itself ([Zador, 2019](https://doi.org/10.1038/s41467-019-11786-6)). Unlike Solomonoff's fixed machine, this machine changes every generation, shaped by what earlier generations met.

**Open questions**

- Is physical simplicity the same as algorithmic simplicity, or two different things that sometimes coincide?
- Is physics computable? The spectral gap of a quantum many-body system is undecidable in general ([Cubitt et al., 2015](https://doi.org/10.1038/nature16059)).
- Can simplicity be defined without choosing a machine, through energy or time instead? Or is the universe's own dynamics the machine for everything inside it?
- How does an inherited machine change over generations, and does it come to make short what the future will need?

Simplicity only matters for things that last long enough to use it. That is the next question.

## 2. Persistence and computation: what lasts?

The base of the theory is a question about physically realised patterns: which of them keep their identity over time, and how. Matter is always the carrier, but identity belongs to the pattern: your atoms turn over and you persist.

**Identity and persistence define each other.** We need identity to say what persists, yet in practice we find identity through persistence. Krakauer et al. define an individual as an aggregate that carries information from its past to its future, which makes individuality graded and possible at several levels at once ([Krakauer et al., 2020](https://doi.org/10.1007/s12064-020-00313-7)). So the question becomes: which patterns hold together, at which levels, and to what degree?

**Two ways to last.** Some things last by doing nothing: a rock sits in a low-energy state (thermodynamic stability). Others last by being remade faster than they decay: a flame, a river, a population of self-copying molecules. Pross calls this dynamic kinetic stability and argues that natural selection is a special case of a chemical drive toward more of it ([Pross, 2012](https://global.oup.com/academic/product/what-is-life-9780199641383)).

**Candidate principles, each persistence plus one ingredient.**

- *Energy flow.* Driven systems tend toward configurations that absorb and dissipate energy well, and replication has a thermodynamic floor set by growth and decay rates ([England, 2013](https://doi.org/10.1063/1.4818538)).
- *Construction history.* Objects that need many joining steps to build, found in many copies, signal selection at work ([Sharma et al., 2023](https://doi.org/10.1038/s41586-023-06600-9)).
- *Function.* Functional information increases in systems of many interacting parts under selection, which acts for static persistence, for dynamic persistence and for novelty ([Wong et al., 2023](https://doi.org/10.1073/pnas.2310223120)).
- *Information.* Semantic information is the part of what a system carries about its environment that it causally needs to keep existing ([Kolchinsky and Wolpert, 2018](https://doi.org/10.1098/rsfs.2018.0041)).

The last points to a bridge. The good regulator theorem says every good regulator of a system must be a model of that system ([Conant and Ashby, 1970](https://doi.org/10.1080/00207727008920220)). If persisting in a changing world requires carrying predictive information about it, then persistence leads to prediction, and prediction to learning.

**Living is a region, not a category.** Every definition of life has hard cases: viruses evolve but do not sustain themselves, prions copy their shape with no genes, and a flame partly maintains itself. Ordered by how they persist, patterns run from static (crystals) to remade by flow (flames, hurricanes) to self-repairing (a cell's metabolism) to copying with heredity (replicators) to learning (organisms that update an internal model). Living things occupy the upper part of that range, with viruses and protocells on its borders.

**Computation is persistence among interacting patterns.** Langton asked when a substrate can store information, transmit it and let the two modify each other, and found these operations near a transition between frozen and chaotic dynamics ([Langton, 1990](https://doi.org/10.1016/0167-2789(90)90064-V)). Each operation is a form of persistence: storage is information lasting in time, transmission is information lasting while it moves, and modification is persisting patterns changing each other. In frozen rules patterns last only by not moving; in chaotic rules nothing keeps its identity; near the edge, patterns persist while moving and interacting, and one such rule, Rule 110, supports universal computation ([Cook, 2004](https://doi.org/10.25088/ComplexSystems.15.1.1)). Whether evolution finds that regime is contested: an early report of drift toward it did not replicate ([Mitchell et al., 1993](https://arxiv.org/abs/adap-org/9303003)).

**Open questions**

- Is there one principle behind persistence, or several that apply in different regimes?
- Does persistence in a changing world imply modelling, and so learning? Is this a theorem or only a tendency?
- Can identity be defined without an observer, or is "the same thing" always relative to how the world is divided up?
- Which interactions among persisting patterns produce storage, transmission and modification together, and does evolution push systems there or only pass through?

Patterns do not just last. They last in different ways, and the ways themselves change.

## 3. Modes of persistence: how does it last?

A pattern can persist in five ways: stay still, be remade by flow, repair itself from inside, copy itself from a description, or learn, remaking its internal model to fit a changing world. Which mode a pattern uses is not fixed. It is itself a trait that varies, is inherited and evolves.

**Modes are phenotypes.** Life-history theory studies how organisms divide resources between maintenance, growth and reproduction, and treats that division as evolved. Kirkwood's disposable soma theory makes it quantitative: invest in repair only as much as reproduction needs ([Kirkwood, 1977](https://doi.org/10.1038/270301a0)). In genetically identical bacteria, a few cells switch at random into dormancy and survive antibiotics that kill the growing ones, a bet hedged across modes ([Balaban et al., 2004](https://doi.org/10.1126/science.1099390)). Cancer is a change of mode at one level, from maintaining the body to proliferating, that breaks persistence at the level above.

**Copying versus repair.** Copying is persistence from outside, repair persistence from inside. Von Neumann saw why copying from a description matters: a lineage can discard a damaged body and rebuild from a compact, clean record ([von Neumann, 1966](https://archive.org/details/theoryofselfrepr00vonn_0)). Copying also allows safe exploration, since a variant is tested while the original survives.

**Generations versus one learner forever.** A single entity that learns forever loses something. Deep networks trained continually lose the ability to learn at all ([Dohare et al., 2024](https://doi.org/10.1038/s41586-024-07711-7)). A new generation resets plasticity while inheriting a compressed prior. Passing knowledge through a learning bottleneck each generation also makes it more structured, as iterated-learning experiments on language show ([Kirby et al., 2008](https://doi.org/10.1073/pnas.0707835105)), and a life cycle that returns to a single cell lets development be rebuilt rather than patched ([Grosberg and Strathmann, 2007](https://doi.org/10.1146/annurev.ecolsys.36.102403.114735)).

**The boundaries blur in nature.** Bacteria from seafloor sediment about 100 million years old were revived and grew, persistence with almost no reproduction ([Morono et al., 2020](https://doi.org/10.1038/s41467-020-17330-1)). A single aspen clone, Pando, has persisted for thousands of years by sprouting new trunks from one root system: growth, repair and reproduction at once. *Turritopsis dohrnii* can revert to its juvenile stage instead of dying. Such cases support treating the modes as one continuum.

**Where copying began.** Self-replicating programs can emerge spontaneously from interacting random programs, with no replicator designed in ([Agüera y Arcas et al., 2024](https://arxiv.org/abs/2406.19108)). All known life shares one ancestry ([Theobald, 2010](https://doi.org/10.1038/nature09014)), but that shows a single surviving lineage, not a single origin. Darwin noted in 1871 that once life exists, newly forming living matter would be consumed before it could start, and early life may have been a community sharing genes rather than one lineage ([Woese, 1998](https://doi.org/10.1073/pnas.95.12.6854)).

**A first experiment.** Make the division between staying still, repairing, copying and learning a heritable trait in a simple model. Vary the damage rate, the energy cost and how fast the environment changes, and record which division evolves. If the results match life-history theory and bacterial bet hedging, the framing earns its keep.

**Open questions**

- When does copying beat repair, as a function of damage, energy and environmental change?
- Why generations rather than one entity learning forever: plasticity, compression, or redesign?
- Did life begin once or many times, and does a first lineage block later origins by taking their resources?
- Can the modes themselves emerge from simpler dynamics, and how does the mode of a lineage evolve?

No pattern persists alone. The modes that win depend on who else is there.

## 4. Ecology: with whom?

Interaction is present from the first level: even before life, prebiotic chemistry is an ecology of reaction networks that catalyse one another. Most of any learner's world is other persisting patterns, so the data it learns from are partly made by them.

**Learners are each other's environment.** Selection on a population has the same form as Bayesian updating. Write wₜ(p) for the share of type p at time t and Pₚ(x) for how well p fits what happens next, x. Then

<div class="equation">
$$
w_{t+1}(p) \propto w_t(p)\, P_p(x_t)
$$
</div>

In Solomonoff's setting, xₜ comes from a fixed source. Among interacting learners, xₜ is produced partly by the population being updated, so the fit of each type depends on the shares of the others: frequency-dependent selection ([Shalizi, 2009](https://arxiv.org/abs/0901.1342); [Bettencourt et al., 2025](https://arxiv.org/abs/2503.09057)). Machine learning meets the single-model case as performative prediction, where a model's predictions change the data it later sees ([Perdomo et al., 2020](https://arxiv.org/abs/2002.06673)), and agents with Solomonoff priors have been extended to settings with several learners ([Meulemans et al., 2025](https://arxiv.org/abs/2511.22226)).

**Diversity comes from thresholds and limits.** Nature rarely ranks everyone on one score; often anything that survives and reproduces persists. Algorithms built on this minimal criterion, such as mazes and maze-solvers that coevolve with no fitness at all, grow steadily more complex ([Brant and Stanley, 2017](https://doi.org/10.1145/3071178.3071186)). Without a cap on how many solvers each maze supports, diversity collapses, so limited resources matter as much as the threshold.

**Niches exist only relative to organisms.** A tree hollow is a niche only for something that can live in it, and organisms build niches for each other and for their descendants ([Laland et al., 2015](https://pmc.ncbi.nlm.nih.gov/articles/PMC4632619)).

**Interaction, not empty space, can drive evolvability.** In a model where each niche keeps at most five individuals at random, a lineage's chance of moving niche (its evolvability) rose from 0.050 to 0.064 in an expanding world. In a world full from the start it still rose, to 0.061, and with niches assigned at random it stayed at 0.050. The reason is kin competition: an offspring that stays home competes with its siblings, one that moves escapes them ([Hamilton and May, 1977](https://doi.org/10.1038/269578a0)). (These figures come from our reimplementation of [Lehman and Stanley, 2013](https://doi.org/10.1371/journal.pone.0062186).)

**Ecology shapes what is simple.** Under threshold selection, merely adequate intermediates persist and become building blocks for later solutions; in digital organisms, a complex function evolved only when simpler intermediate functions were also rewarded ([Lenski et al., 2003](https://doi.org/10.1038/nature01568)). Others can also make things simple for you: a symbiont doing a job, or culture passing on a skill.

**Populations of artificial learners already show this.** Language-model agents with no individual bias develop shared conventions and collective biases through interaction alone ([Ashery et al., 2025](https://doi.org/10.1126/sciadv.adu9368)).

**Where one unit ends.** In the major transitions, replicators joined into cells and cells into organisms ([Maynard Smith and Szathmáry, 1995](https://global.oup.com/academic/product/the-major-transitions-in-evolution-9780198502944)). Such transitions, driven by synergistic interactions, are equivalent to learning the structure of a hierarchical model ([Czégel et al., 2019](https://doi.org/10.1098/rsos.190202)). The boundary of an interaction is therefore also the boundary of an identity, which ties this section back to the second.

**Open questions**

- Which interactions sustain novelty, rather than cycling or stalling?
- How do interactions themselves evolve: who interacts with whom, and how strongly?
- When do interacting units fuse into a new individual, and when do they stay apart?
- How does ecology change what is simple to learn or evolve next?

Among interacting patterns, some get better at persisting by using what they have met. That is learning.

## 5. Learning: how does it get better at lasting?

Learning is the mode of persistence in which a pattern updates an internal model from experience so that it keeps fitting a changing world. Everything in the earlier sections converges here: learning uses an inherited prior, needs a substrate that computes, competes with other modes, and happens among other learners.

**The ideal learner, and why it cannot exist.** Solomonoff induction runs every program on a universal machine, weights each by 2 to the power of minus its length, and predicts by their weighted vote ([Solomonoff, 1964](https://raysolomonoff.com/publications/1964pt1.pdf)). If the data come from any computable source μ, its total excess surprise over the whole sequence is bounded:

<div class="equation">
$$
\sum_{t} \mathbb{E}\left[\text{surprise}_t\right] \le K(\mu) + c
$$
</div>

Here K(μ) is the length of the shortest program for μ and c depends only on the machine. The guarantee needs everything the earlier sections took away. It needs a fixed machine, but machines are inherited and change (section 1). It needs a reliable substrate and unlimited search, but real learners are finite, unreliable patterns (section 2). It needs a world it neither touches nor belongs to, with no other learners, but the data come partly from the learner and its neighbours (section 4). Even in principle the predictor is uncomputable, so a world containing it is not a computable source, and its guarantee no longer applies ([Leike et al., 2016](https://arxiv.org/abs/1609.05058)). Solomonoff is the limit in which everything is given; a theory of learning must recover it there and explain everything it assumes.

**What learning is.** A working definition: learning is history-dependent change in a pattern's internal model that improves its future persistence or prediction, at some cost. Computation alone maps inputs to outputs; learning changes that mapping in light of experience. Evolution fits the same definition at the scale of populations: selection reweights types exactly as Bayes' rule reweights hypotheses ([Harper, 2009](https://arxiv.org/abs/0911.1763); [Czégel et al., 2022](https://doi.org/10.1002/bies.202100255)). Within one body, selection also runs among neurons and among immune cells. Learning and evolution are one process seen at two timescales.

**Modes can be learned, inherited and lost.** What one generation learns can become innate in later ones. In Hinton and Nowlan's model, alleles that had to be guessed each lifetime are gradually replaced by fixed correct ones, because organisms born knowing more find the solution sooner ([Hinton and Nowlan, 1987](https://www.cs.toronto.edu/~hinton/absps/evolution.htm)). This is the Baldwin effect with genetic assimilation. It also runs backwards: when learning or culture reliably supplies a trait, selection on the innate version relaxes and it decays ([Lahti et al., 2009](https://doi.org/10.1016/j.tree.2009.03.010); [Deacon, 2010](https://doi.org/10.1073/pnas.0914624107)). So a mode of persistence can itself be an output of earlier learning, persisting as a phenotype.

**Credit assignment, and how it evolves.** Every learner must decide which of its parts deserve credit for success. Backpropagation sends a global error signal to every weight. Selection credits whole organisms and never their parts directly. Local rules, such as strengthening connections that fire together, credit parts by correlation. In the major transitions, credit shifts from parts to wholes: once cells form an organism, fitness belongs to the organism, and cells that pursue their own gain become cancer ([Michod, 1999](https://press.princeton.edu/books/paperback/9780691050119/darwinian-dynamics)). How a population of units comes to assign credit to a collective, and how the rule for assigning credit itself evolves, is open.

**Learning evolves.** Its rules evolve: evolved plasticity and meta-learning shape how weights change. What is worth learning evolves: reward functions found by evolutionary search often differ from the task's own objective and reward curiosity-like signals ([Singh, Lewis and Barto, 2010](https://doi.org/10.1109/TAMD.2010.2051031)). Whether to learn at all evolves too: learning pays only when the environment is predictable enough for experience to help, but not so stable that fixed behaviour suffices ([Stephens, 1991](https://doi.org/10.1093/beheco/2.1.77)).

**Learning and evolvability go together.** Evolvability, a lineage's capacity to produce useful heritable variation, is to evolution what generalisation is to learning ([Watson and Szathmáry, 2016](https://doi.org/10.1016/j.tree.2015.11.009)). Selection that fails to improve evolvability is the evolutionary analogue of overfitting ([Kouvaris et al., 2017](https://doi.org/10.1371/journal.pcbi.1005358)). Both depend on inherited machines: a genotype–phenotype map that biases variation, and a prior that biases learning. Variation is random with respect to present needs but not uniform; development steers it along directions that worked before. How much variation should be learned and how much left random, given how predictable the world is, is an exploration–exploitation problem that evolution solves without a designer.

**How learning generates open-endedness.** A system is often called open-ended when it keeps producing artefacts that are both new and learnable to an observer ([Hughes et al., 2024](https://arxiv.org/abs/2406.04268)); an information-theoretic version asks whether an agent can keep gaining information that pays ([Xu et al., 2026](https://arxiv.org/abs/2606.08369)), and strong open-ended evolution has been proved to require undecidability ([Hernández-Orozco et al., 2018](https://arxiv.org/abs/1606.01810)). Learning drives this when it changes the world that other learners learn from: each solution moves the target for everyone else and can open new niches. But nothing guarantees it. Evolvability and niches can grow and can also shrink, and apparent trends toward complexity may be passive drift away from a lower limit. Every artificial system built so far eventually plateaus.

**Open questions**

- What separates learning from mere change, and can the answer be stated as a measurable quantity?
- When does what was learned become innate, and when does innate fade back to learned?
- How does credit assignment evolve, from parts to wholes and back?
- Does what is worth learning evolve together with the capacity to learn it and the niches that make it worth learning?
- Under what conditions does learning keep creating new learnable problems, rather than converging or producing noise?

Every word in this section, simple, new, learnable, evolvable, was measured by someone. The last question is who.

## 6. The observer: for whom?

Every quantity in this essay was relative to someone measuring it, and that someone is itself a learner at some level: a unit, a collective, or a population of collectives. A theory of learning must therefore describe the observer with the same tools it uses for everything else.

**Every measure so far had an observer.**

- *Simplicity* is relative to a machine (section 1).
- *Identity* is relative to how the world is divided up (section 2).
- *Novelty* is measured along descriptors someone chose; whoever picks the descriptor largely decides what counts as new.
- *Evolvability* is relative to the environments a lineage will meet, and looks higher when we survey occupied forms rather than individuals.
- *A niche* exists only relative to an organism that can use it (section 4).

**The observer cannot stand outside.** Solomonoff's predictor watches a world it does not belong to. A real observer is part of what it observes, so a complete model of its world is larger than itself ([Wolpert, 2008](https://arxiv.org/abs/0708.1362)). And the observer is built by the same process it observes: its machine was inherited, its purposes came from persistence, and its descriptors were learned. Cybernetics, which studied control and communication in animals and machines together ([Wiener, 1948](https://mitpress.mit.edu/9780262730099/cybernetics/)), later made the same move when its second-order form treated the observer as part of the system it studies.

**What a common measure would need.** Fields judge progress by fitness, reward, loss or human judgement of life-likeness, and none of these can be compared with the others. A shared quantity would have to apply to all four; count the costs of computation, memory and energy; and be defined for an observer at any level, so that a cell, an organism and a population can be compared. The natural candidate is information relative to a bounded observer. Epiplexity, the amount of structure a time-bounded observer can extract from data ([Finzi et al., 2026](https://arxiv.org/abs/2601.03220)), is one such measure; adding the thermodynamic cost of keeping information ([Still et al., 2012](https://doi.org/10.1103/PhysRevLett.109.120604)) would count energy as well.

**Closing the loop.** The essay began by asking what counts as simple, and the answer now has a subject. What is simple is what an observer, built by its own history and by the learners around it, can compress. The prior of section 1 is the observer of section 6, one turn of the loop later. The central question of a theory of learning is then: at every scale and at every time, which physically realised patterns keep their identity, by what modes, and how do those modes, including learning itself, arise and change?

**Open questions**

- Is there a single quantity that applies across fitness, reward, loss and novelty?
- Can an observer at one level measure learning at another level fairly, or only its own?
- How does a learner come to be an observer: when does persisting become measuring?
- What would it take to test such a measure on a toy world, such as cellular automata or the evolvability model above?

## References

### Why these questions now

[Speculations concerning the first ultraintelligent machine](https://doi.org/10.1016/S0065-2458(08)  

Good, 60418-0). Advances in Computers, 1965.

[Gödel machines: self-referential universal problem solvers making provably optimal self-improvements](https://arxiv.org/abs/cs/0309048)  

Schmidhuber, 2003.

[When AI builds itself](https://www.anthropic.com/institute/recursive-self-improvement)  

Anthropic, The Anthropic Institute, 2026.

[AlphaEvolve: a coding agent for scientific and algorithmic discovery](https://arxiv.org/abs/2506.13131)  

Novikov et al., Google DeepMind, 2025.

[Recursive self-improvement in AI: from bounded self-refinement to autonomous research loops](https://arxiv.org/abs/2607.07663)  

Chen, Wang and Qu, 2026.

[OPUS: efficient and principled data selection in LLM pre-training in every iteration](https://arxiv.org/abs/2602.05400)  

Wang et al., ICML, 2026.

[Scaling latent reasoning via looped language models](https://arxiv.org/abs/2510.25741)  

Zhu et al., 2025.

[Dust: pretraining transformers without backpropagation](https://github.com/qlabs-eng/dust)  

Dahal, Mandal, Gülbahar and Vegesna, Q Labs, 2026.

[Nested learning: the illusion of deep learning architectures](https://arxiv.org/abs/2512.24695)  

Behrouz, Razaviyayn, Zhong and Mirrokni, NeurIPS, 2025.

[Prime Agent: a self-improving RLM harness](https://arxiv.org/abs/2608.23552)  

Jaghouar et al., 2026.

[Agent Swarm](https://www.kimi.ai/help/agent/agent-swarm)  

Kimi Team, Moonshot AI, 2026.

[Emergent social conventions and collective bias in LLM populations](https://doi.org/10.1126/sciadv.adu9368)  

Ashery, Aiello and Baronchelli, Science Advances, 2025.

[Does reinforcement learning really incentivize reasoning capacity in LLMs beyond the base model?](https://arxiv.org/abs/2504.13837)  

Yue et al., NeurIPS, 2025.

[Darwin Gödel Machine: open-ended evolution of self-improving agents](https://arxiv.org/abs/2505.22954)  

Zhang, Hu, Lu, Lange and Clune, ICLR, 2026.

### 1. Priors

[Solomonoff induction](https://arxiv.org/abs/2603.20274)  

Sterkenburg, 2026.

[Bad universal priors and notions of optimality](https://arxiv.org/abs/1510.04931)  

Leike and Hutter, COLT, 2015.

[Algorithmic randomness and physical entropy](https://doi.org/10.1103/PhysRevA.40.4731)  

Zurek, Physical Review A, 1989.

[Thermodynamic costs of Turing machines](https://doi.org/10.1103/PhysRevResearch.2.033312)  

Kolchinsky and Wolpert, Physical Review Research, 2020.

[Law without law: from observer states to physics via algorithmic information theory](https://arxiv.org/abs/1712.01826)  

Müller, Quantum, 2020.

[Input–output maps are strongly biased towards simple outputs](https://doi.org/10.1038/s41467-018-03101-6)  

Dingle, Camargo and Louis, Nature Communications, 2018.

[Symmetry and simplicity spontaneously emerge from the algorithmic nature of evolution](https://doi.org/10.1073/pnas.2113883119)  

Johnston et al., PNAS, 2022.

[A critique of pure learning](https://doi.org/10.1038/s41467-019-11786-6)  

Zador, Nature Communications, 2019.

[Undecidability of the spectral gap](https://doi.org/10.1038/nature16059)  

Cubitt, Pérez-García and Wolf, Nature, 2015.

### 2. Persistence and computation

[The information theory of individuality](https://doi.org/10.1007/s12064-020-00313-7)  

Krakauer et al., Theory in Biosciences, 2020.

[What Is Life? How Chemistry Becomes Biology](https://global.oup.com/academic/product/what-is-life-9780199641383)  

Pross, Oxford University Press, 2012.

[Statistical physics of self-replication](https://doi.org/10.1063/1.4818538)  

England, Journal of Chemical Physics, 2013.

[Assembly theory explains and quantifies selection and evolution](https://doi.org/10.1038/s41586-023-06600-9)  

Sharma et al., Nature, 2023.

[On the roles of function and selection in evolving systems](https://doi.org/10.1073/pnas.2310223120)  

Wong et al., PNAS, 2023.

[Semantic information, autonomous agency and non-equilibrium statistical physics](https://doi.org/10.1098/rsfs.2018.0041)  

Kolchinsky and Wolpert, Interface Focus, 2018.

[Every good regulator of a system must be a model of that system](https://doi.org/10.1080/00207727008920220)  

Conant and Ashby, International Journal of Systems Science, 1970.

[Computation at the edge of chaos](https://doi.org/10.1016/0167-2789(90)  

Langton, 90064-V). Physica D, 1990.

[Universality in elementary cellular automata](https://doi.org/10.25088/ComplexSystems.15.1.1)  

Cook, Complex Systems, 2004.

[Revisiting the edge of chaos](https://arxiv.org/abs/adap-org/9303003)  

Mitchell, Hraber and Crutchfield, Complex Systems, 1993.

### 3. Modes of persistence

[Evolution of ageing](https://doi.org/10.1038/270301a0)  

Kirkwood, Nature, 1977.

[Bacterial persistence as a phenotypic switch](https://doi.org/10.1126/science.1099390)  

Balaban et al., Science, 2004.

[Theory of Self-Reproducing Automata](https://archive.org/details/theoryofselfrepr00vonn_0)  

von Neumann, University of Illinois Press, 1966.

[Loss of plasticity in deep continual learning](https://doi.org/10.1038/s41586-024-07711-7)  

Dohare et al., Nature, 2024.

[Cumulative cultural evolution in the laboratory](https://doi.org/10.1073/pnas.0707835105)  

Kirby, Cornish and Smith, PNAS, 2008.

[The evolution of multicellularity: a minor major transition?](https://doi.org/10.1146/annurev.ecolsys.36.102403.114735)  

Grosberg and Strathmann, Annual Review of Ecology, Evolution, and Systematics, 2007.

[Aerobic microbial life persists in oxic marine sediment as old as 101.5 million years](https://doi.org/10.1038/s41467-020-17330-1)  

Morono et al., Nature Communications, 2020.

[Computational life: how well-formed, self-replicating programs emerge from simple interaction](https://arxiv.org/abs/2406.19108)  

Agüera y Arcas et al., 2024.

[A formal test of the theory of universal common ancestry](https://doi.org/10.1038/nature09014)  

Theobald, Nature, 2010.

[The universal ancestor](https://doi.org/10.1073/pnas.95.12.6854)  

Woese, PNAS, 1998.

### 4. Ecology

[Dynamics of Bayesian updating with dependent data and misspecified models](https://arxiv.org/abs/0901.1342)  

Shalizi, Electronic Journal of Statistics, 2009.

[Redefining fitness: evolution as a dynamic learning process](https://arxiv.org/abs/2503.09057)  

Bettencourt, Grandison and Kemp, 2025.

[Performative prediction](https://arxiv.org/abs/2002.06673)  

Perdomo, Zrnic, Mendler-Dünner and Hardt, ICML, 2020.

[Embedded universal predictive intelligence](https://arxiv.org/abs/2511.22226)  

Meulemans et al., 2025.

[Minimal criterion coevolution: a new approach to open-ended search](https://doi.org/10.1145/3071178.3071186)  

Brant and Stanley, GECCO, 2017.

[The extended evolutionary synthesis](https://pmc.ncbi.nlm.nih.gov/articles/PMC4632619)  

Laland et al., Proceedings of the Royal Society B, 2015.

[Dispersal in stable habitats](https://doi.org/10.1038/269578a0)  

Hamilton and May, Nature, 1977.

[Evolvability is inevitable](https://doi.org/10.1371/journal.pone.0062186)  

Lehman and Stanley, PLoS ONE, 2013.

[The evolutionary origin of complex features](https://doi.org/10.1038/nature01568)  

Lenski et al., Nature, 2003.

[The Major Transitions in Evolution](https://global.oup.com/academic/product/the-major-transitions-in-evolution-9780198502944)  

Maynard Smith and Szathmáry, Oxford University Press, 1995.

[Multilevel selection as Bayesian inference, major transitions in individuality as structure learning](https://doi.org/10.1098/rsos.190202)  

Czégel, Zachar and Szathmáry, Royal Society Open Science, 2019.

### 5. Learning

[A formal theory of inductive inference](https://raysolomonoff.com/publications/1964pt1.pdf)  

Solomonoff, Information and Control, 1964.

[A formal solution to the grain of truth problem](https://arxiv.org/abs/1609.05058)  

Leike, Taylor and Fallenstein, UAI, 2016.

[The replicator equation as an inference dynamic](https://arxiv.org/abs/0911.1763)  

Harper, 2009.

[Bayes and Darwin](https://doi.org/10.1002/bies.202100255)  

Czégel, Giaffar, Tenenbaum and Szathmáry, BioEssays, 2022.

[How learning can guide evolution](https://www.cs.toronto.edu/~hinton/absps/evolution.htm)  

Hinton and Nowlan, Complex Systems, 1987.

[Relaxed selection in the wild](https://doi.org/10.1016/j.tree.2009.03.010)  

Lahti et al., Trends in Ecology and Evolution, 2009.

[A role for relaxed selection in the evolution of the language capacity](https://doi.org/10.1073/pnas.0914624107)  

Deacon, PNAS, 2010.

[Darwinian Dynamics](https://press.princeton.edu/books/paperback/9780691050119/darwinian-dynamics)  

Michod, Princeton University Press, 1999.

[Intrinsically motivated reinforcement learning: an evolutionary perspective](https://doi.org/10.1109/TAMD.2010.2051031)  

Singh, Lewis, Barto and Sorg, IEEE Transactions on Autonomous Mental Development, 2010.

[Change, regularity, and value in the evolution of animal learning](https://doi.org/10.1093/beheco/2.1.77)  

Stephens, Behavioral Ecology, 1991.

[How can evolution learn?](https://doi.org/10.1016/j.tree.2015.11.009)  

Watson and Szathmáry, Trends in Ecology and Evolution, 2016.

[How evolution learns to generalise](https://doi.org/10.1371/journal.pcbi.1005358)  

Kouvaris et al., PLoS Computational Biology, 2017.

[Open-endedness is essential for artificial superhuman intelligence](https://arxiv.org/abs/2406.04268)  

Hughes et al., ICML, 2024.

[An information-theoretic definition for open-ended learning](https://arxiv.org/abs/2606.08369)  

Xu, Zhu and Van Roy, 2026.

[Undecidability and irreducibility conditions for open-ended evolution and emergence](https://arxiv.org/abs/1606.01810)  

Hernández-Orozco, Hernández-Quiroz and Zenil, Artificial Life, 2018.

### 6. The observer

[Physical limits of inference](https://arxiv.org/abs/0708.1362)  

Wolpert, Physica D, 2008.

[Cybernetics: Or Control and Communication in the Animal and the Machine](https://mitpress.mit.edu/9780262730099/cybernetics/)  

Wiener, MIT Press, 1948.

[From entropy to epiplexity](https://arxiv.org/abs/2601.03220)  

Finzi et al., 2026.

[Thermodynamics of prediction](https://doi.org/10.1103/PhysRevLett.109.120604)  

Still, Sivak, Bell and Crooks, Physical Review Letters, 2012.
</div>
