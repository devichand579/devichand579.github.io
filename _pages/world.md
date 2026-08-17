---
layout: page
permalink: /world/
title: world
description: A small physical world. Infer the hidden law, then predict the next state.
nav: true
nav_order: 7
world_law: true
---

<div id="world-law" class="world-law">
  <p>
    Four observations of the same world, each shown at time <em>t</em> and a moment later at <em>t+1</em>.
    The law is unique, physical, and unchanged across worlds. Paint the next state of the test world.
  </p>

  <div class="wl-legend" aria-label="materials">
    <span class="wl-swatch is-air"><span>air</span></span>
    <span class="wl-swatch is-soil"><span>soil</span></span>
    <span class="wl-swatch is-rock"><span>rock</span></span>
    <span class="wl-swatch is-water"><span>water</span></span>
    <span class="wl-swatch is-seed"><span>seed</span></span>
    <span class="wl-swatch is-plant"><span>plant</span></span>
  </div>

  <div class="wl-section-title">observations</div>
  <div class="wl-observations" data-observations></div>

  <div class="wl-section-title">the next world</div>
  <div class="wl-meta">
    <span>streak <strong data-streak>0</strong></span>
    <span>choose a material, then paint the grid at t+1</span>
  </div>

  <div class="wl-play">
    <div class="wl-pane">
      <span>t</span>
      <div data-play-input></div>
    </div>
    <div class="wl-pane">
      <span>t+1</span>
      <div data-play-output></div>
    </div>
  </div>

  <div class="wl-palette" data-palette></div>
  <div class="wl-actions">
    <button type="button" data-copy>copy t</button>
    <button type="button" data-clear>clear</button>
    <button type="button" data-check>check</button>
    <button type="button" data-new>new world</button>
  </div>
  <div class="wl-status" data-status></div>
</div>
