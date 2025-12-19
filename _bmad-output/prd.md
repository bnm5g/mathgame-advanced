---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: []
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 0
  projectDocs: 0
workflowType: 'prd'
lastStep: 4
project_name: 'mathgame-advanced'
user_name: 'Minh'
date: '2025-12-17T14:52:31+07:00'
---

# Product Requirements Document - mathgame-advanced

**Author:** Minh
**Date:** 2025-12-17T14:52:31+07:00

## Executive Summary

**Calculus Racer** is a real-time multiplayer web game that transforms abstract calculus concepts—position, velocity, acceleration, and jerk—into an engaging competitive racing experience. Built for entertainment with family, friends, and fellow math enthusiasts, it creates a "semi-real scenario" where players directly experience the relationship between derivatives through gameplay.

**Target Audience**: While designed with broad appeal across all three segments (families seeking educational entertainment, friends wanting competitive social gaming, and math enthusiasts appreciating the physics depth), the primary focus is on **competitive friends and casual math learners**—people who want a fun way to pass time that happens to build mathematical intuition, rather than students forced to study.

Players compete in races where answering math questions correctly grants values that can be strategically allocated to their vehicle's physics variables. The high-stakes mechanic—where wrong answers reset all stats—creates tension and encourages careful thinking, while the real-time physics simulation makes calculus concepts tangible and immediate. The game introduces these concepts progressively, so players learn the physics through play rather than textbooks—no prior knowledge of derivatives required.

### What Makes This Special

**Calculus Racer** challenges the belief that math is boring and disconnected from everyday life by:

- **Making derivatives visceral**: Players don't just calculate derivatives—they *feel* them as their vehicle responds to changes in jerk → acceleration → velocity → position
- **Strategic depth through physics**: The choice of where to allocate points (immediate velocity boost vs. long-term jerk investment) creates genuine strategic gameplay
- **High-stakes engagement**: The brutal "wrong answer = full reset" mechanic transforms a casual math game into an adrenaline-filled competition
- **Multiplayer social experience**: Competing with friends and family makes math practice a shared, fun activity rather than solitary study

If successful, users will have discovered a new way to pass time that's genuinely entertaining while building intuitive understanding of calculus concepts—proving that math can be both fun and applicable to real (or semi-real) scenarios.

## Project Classification

**Technical Type:** web_app  
**Domain:** edtech  
**Complexity:** medium  
**Project Context:** Greenfield - new project

**Scale Target**: Initial target: Support 100 concurrent games (400 players) with architecture designed for 10x growth via horizontal scaling.

This is a real-time multiplayer browser-based game requiring:
- WebSocket or Firebase Realtime Database for multiplayer synchronization
- Client-side physics simulation (position, velocity, acceleration, jerk calculations)
- Customizable question banks (JSON-based for flexibility across subjects)
- Matchmaking system (public queue + private rooms)
- Responsive UI showing real-time race state and physics variables

The educational domain (edtech) with medium complexity reflects the need to balance entertainment value with mathematical accuracy, while keeping the technical implementation accessible for a greenfield web project.

## Success Criteria

### User Success

Users will consider **Calculus Racer** successful when they:

- **Have fun competing**: Complete at least one full race and choose to play again
- **Experience social engagement**: Play with friends in private rooms or meet new competitors in public queues, with optional friendly wagering (ice cream, pennies, bragging rights)
- **Gain intuitive physics understanding**: Make strategic decisions about variable allocation, understanding the trade-offs between immediate impact (velocity) and long-term advantage (jerk)
- **Experience the "aha" moment**: Feel the visceral connection between their mathematical choices and the car's movement, seeing derivatives in action rather than just on paper

**Key User Outcome**: Users walk away having had fun AND understanding how different variables (position, velocity, acceleration, jerk) affect their car's speed and trajectory.

### Business Success

**3-Month Target:**
- **10 games played daily** (minimum 40 active players assuming 4 per game)

**Key Metrics to Track:**
- **Total daily games played** (primary success indicator)
- **Average game duration** (to understand engagement depth and identify pacing issues)
- **Correct/wrong answer rate per game** (to balance question difficulty and maintain challenge)

**12-Month Vision:**
- Scale to 100+ daily games with organic growth through word-of-mouth and social sharing

### Technical Success

**Performance Requirements:**
- **Client-side physics**: 30fps minimum rendering with smooth interpolation
- **Server sync rate**: 10-20 ticks/second via Firebase Realtime Database
- **Answer response time**: < 500ms from submission to result display (feels instant)

**Reliability Requirements:**
- **Game completion rate**: 90% of games complete without server/code errors
- **Sync quality**: All players see consistent race state within 500ms (acceptable for Firebase latency)
- **Error handling**: Graceful degradation when players disconnect (game continues for remaining players)

**Scalability:**
- Support 100 concurrent games (400 players) at launch
- Architecture designed for 10x growth without major refactoring

### Measurable Outcomes

**Week 1 Post-Launch:**
- 5+ games completed successfully without critical bugs
- Average game duration measured and documented
- Question difficulty calibrated based on correct/wrong rates

**Month 1:**
- 5 games/day average
- 80%+ game completion rate
- User feedback collected on physics "feel" and question difficulty

**Month 3:**
- 10 games/day target achieved
- 90%+ game completion rate
- Evidence of repeat players (same users playing multiple times)

## Product Scope

### MVP - Minimum Viable Product

**Core Mechanics (Must Work Flawlessly):**
- Physics simulation: Real-time calculation of position, velocity, acceleration, jerk
- Question flow: Display question → Accept answer → Grant value → Allow allocation
- "Wrong answer = reset all stats" mechanic (the high-stakes element)
- Real-time multiplayer sync for 4 players via Firebase
- Win condition: First player to reach finish line
- Basic matchmaking: Public queue OR private room creation with password

**Functional UI (Not Polished):**
- Display current physics variables for all 4 players
- Show question with 4 multiple-choice answers
- Buttons to allocate earned value to [POS/VEL/ACC/JERK]
- Visual race track showing relative positions
- Basic game state indicators (whose turn, time elapsed)

**Content:**
- Single hardcoded question set (calculus/derivatives focus)
- Fixed finish line distance
- Default physics constants (time step, update rate)

### Growth Features (Post-MVP)

**UI Polish:**
- Animations and visual effects
- "SpaceX aesthetic" - minimalist, data-heavy, premium feel
- Sparklines/graphs showing variable trends over time
- Sound effects and haptic feedback

**Question Customization:**
- User-uploaded question packs (JSON import)
- Difficulty levels (easy/medium/hard)
- Subject variety (geography, history, general knowledge)
- Question tagging and filtering for room settings

**Engagement Features:**
- Leaderboards and persistent stats tracking
- Player profiles and match history
- Spectator mode for completed games
- Replay system

**Scalability:**
- Support for more than 4 players per game
- Regional matchmaking for lower latency
- Tournament mode with brackets

### Vision (Future)

**AI-Powered Features:**
- AI-generated questions tailored to player skill level
- Adaptive difficulty based on performance
- Personalized learning paths

**Platform Expansion:**
- Mobile app version (iOS/Android)
- Desktop app with offline practice mode
- Integration with educational platforms (Google Classroom, Canvas)

**Community Features:**
- User-generated content marketplace for question packs
- Clan/team system for group competitions
- Streaming integration for content creators


## User Journeys

### Journey 1: Alex Chen - The Competitive Study Group Player

**Persona:** Alex Chen, 19-year-old college sophomore studying engineering. Member of a 4-person study group preparing for Calculus II midterm.

**The Story:**

It's 9 PM on a Tuesday. Alex and his study group have been working through derivative problems for 2 hours and everyone's losing focus. Someone jokes "I wish studying was actually fun." Alex remembers seeing Calculus Racer mentioned on Reddit and suggests they try it.

They create a private room, share the password in their group chat, and within 2 minutes all 4 are racing. The first question appears: "Find f'(x) for f(x) = 3x² + 5x". Alex answers correctly, gets +15 points, and strategically adds it to Jerk for long-term advantage. His friend Sarah rushes, gets it wrong, and watches in horror as all her stats reset to zero while Alex's car pulls ahead.

The breakthrough moment comes when Alex realizes he's not just memorizing formulas—he's *feeling* how jerk builds into acceleration builds into velocity. After 3 races (and some friendly trash talk), they've practiced 40+ derivative problems without it feeling like studying. Alex's group makes Calculus Racer their Tuesday night ritual.

**Key Moments:**
- **Discovery**: Finding the game through social recommendation (Reddit)
- **Setup**: Creating private room and sharing password with friends
- **First Question**: Experiencing the answer → value allocation flow
- **High Stakes**: Witnessing the "wrong answer = reset" mechanic in action
- **Aha Moment**: Feeling the visceral connection between derivatives and car movement
- **Retention**: Making it a recurring group activity

### Journey 2: Sarah Martinez - The Innovative Teacher (Room Host)

**Persona:** Sarah Martinez, high school AP Calculus teacher with 30 students, looking to make review sessions more engaging.

**The Story:**

Sarah has 30 students in her AP Calculus class, and review sessions are always a struggle. Students zone out, check their phones, and treat it like a chore. She discovers Calculus Racer and decides to try something different.

Before Friday's review session, Sarah creates a private room and sets a password. She projects the room code on the classroom screen and divides students into groups of 4. "First team to finish 3 races wins extra credit," she announces.

The room fills up quickly. Sarah watches as her usually quiet students start strategizing out loud: "Should I add to velocity or save for jerk?" One student who always struggles with derivatives suddenly understands the chain rule because she can *see* how the variables cascade into each other.

The real win comes when students ask if they can use Calculus Racer for their study groups at home. Sarah shares the link, and suddenly her students are voluntarily practicing calculus on weekends.

**Key Moments:**
- **Discovery**: Finding an educational tool that bridges fun and learning
- **Preparation**: Creating room before class session with password
- **Classroom Integration**: Projecting room code and organizing students into teams
- **Facilitation**: Observing gameplay and student engagement
- **Educational Impact**: Witnessing students grasp concepts through gameplay
- **Viral Adoption**: Students requesting to use it outside of class

### Journey Requirements Summary

These journeys reveal the following capability requirements for **Calculus Racer**:

**Core Gameplay Capabilities:**
- Real-time multiplayer racing for 4 players
- Question display with 4 multiple-choice answers
- Answer validation (correct/wrong)
- Value allocation interface (POS/VEL/ACC/JERK buttons)
- Physics simulation with visible car movement
- "Wrong answer = reset all stats" mechanic
- Win condition detection (first to finish line)

**Room Management Capabilities:**
- Private room creation with password
- Room code/ID generation for sharing
- Password-protected room access
- Room host controls (start game, manage players)
- Support for multiple concurrent rooms

**Discovery & Onboarding:**
- Easy-to-share room links or codes
- Quick join flow (enter code + password)
- Minimal friction from discovery to first game

**Social & Engagement:**
- Real-time visibility of all players' stats
- Visual feedback for correct/wrong answers
- Competitive elements (seeing who's ahead)
- Support for recurring play sessions

**Educational Value:**
- Progressive concept introduction (no prior knowledge required)
- Visual representation of derivative relationships
- Sufficient question variety for practice
- Immediate feedback on answers
