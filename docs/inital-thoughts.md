# Initial Thoughts

Initial Objective: Create a 5x3 slot game.

- Build the visual element:
    - Background
    - Reels
        - 30 slots, with 3 visible at a time
    - UI
        - Spin Button
        - Auto-play button
        - Increase-Decrease Bet Buttons
        - Credit text
        - Bet text
        - Win text
        - *Settings and information*
- Build a configurable database that allows for adjustments to:
    - Icons and pay-out multipliers
    - Win conditions
    - Current User Stats (credit)
- Twist focuses on a 97% RTP

Slot:

- Image
- Value/Multiplier
- Animation State
    - Default
    - Part of a win
    - Part of a bonus

Reel:

- 30 slots
- RNG decides the stop point.
- These slots can be changed for bonus reels.
- Data Structure:
    - slots[]
    - Bonus slots[]
    - Position
    - Target Position
    - Spin Delay

Background:

- Needs layers, to sit in front & behind the reels.
- Different variation for bonus?

Game State:

- User balance
- Bet size
- Is spinning?
- Is auto play?
    - Do we speed up the time scale, or just skip the animation?

What effects happen on a win?

Let’s not focus on bonus or win states just yet, let’s just get the spin and auto spin up and running.

Target 1280x720.
