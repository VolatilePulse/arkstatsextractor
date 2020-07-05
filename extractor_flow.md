# Inputs require

All 48 server stat multipliers, server's singleplayer setting, and BabyImprintStatScaleMultiplier
The all 12 creature's stat values (Unused stats can be NaN), creature level, if creature is Wild/Tamed/Bred
and if bred, Imprint Value is required
A species object that contains all of the stat values and additional data for the extractor

-   All numbers should be converted to IA's with an appropriate range

# Condition inputs for Extractor

## Inputs

Server multipliers
Species multipliers

Creature level
Creature stat values
Format values based on input type (Ark, Export)
Extraction type (wild/tamed/bred)

-   If bred, imprint value

## Outputs

Array of Interval values
Array of Multipliers for all 12 stats
Conditioned for Extraction type
Interval for TE and imprint based on Extraction type

## Description

Convert Values to a range
Multiply server multipliers by singleplayer multipliers if singleplayer is true
Based on Extraction Type, condition multipliers

-   If wild, set all "tamed" multipliers to 0
-   If tamed, set all "bred" multipliers to 0

Combine species and server multipliers with CombineMultipliers
Based on Extraction Type, condition TE and Imprint ranges

-   If wild, set TE and Imprint to IA.ZERO
-   If tamed, set TE to IA(0, 1) and Imprint to IA.ZERO
-   If bred, set TE to IA.ONE and Imprint to IA(Imprint - 0.5%, Imprint + 0.5%)

# Condition Server

## Inputs

Server multipliers

## Outputs

Server multipliers

## Description

If server's singleplayer is true, multiply multipliers against singleplayer multipliers

# Extract creature base & domestic levels

## Inputs:

Creature level
Creature is wild/tamed/bred
Creature's Torpor value
Creature's Imprint range

Species' Torpor values

Server's Torpor multipliers
Server's Imprint bonus multiplier

## Outputs:

On success:
Array of 1 or more [Base Level, Domestic Levels, Valid Imprint Range]
On failure:
Empty Array

## Description:

Calculate possible level range based on Imprint value
Reverse torpor calculation
Output is base level (wild levels from torpor + 1) & domestic level (level - base level)
Multiple outputs may be possible due to Imprint value range

If multiple outputs from above exist
Loop across the rest until all outputs are exhausted
Or until at least one stat combination exists for all stats (after filtering)

If bred:

# Calculate new Imprint Range

## Inputs:

Creature's Base Level
Creature's Torpor value
Creature's Imprint range

Species' Torpor values

Server's Torpor multipliers
Server's Imprint bonus multiplier

## Outputs:

On success:
New Imprint Range (as IA)
On failure:
IA.empty()

## Description:

Narrow down the imprint range based on the calculated Base level

If creature is bred
Find largest stat value (not Torpor) to narrow the Imprint value range (typically food)
Verify new Imprint value range still works with Torpor
Only works if largest value is unleveled domestically

Loop each stat (maybe do uncalculable stats last)
If stat is not used or can't be leveled
Wild and Domestic levels = 0

Calculate max possible wild & domestic (if not wild) levels for stat
Max possible or available levels should be used, whichever is smallest

Use calculated max poss levels to loop all possible level combinations
Generate a level pair that allows the stat to be calculated

If stat is TE based
TE range needs to also be calculated
TE range should allow the wild level to be calculated (backwards and forwards)
If multiple stats are TE based
Each stat after the first one must have an intersecting TE range with all other
stat (A creature can only have 1 TE and must be the same for all stats)

If stat is affected by imprint
Imprint value range should be reduced, if possible

Available wild and domestic levels should be reduced by the "minimum" number of each
level needed per stat. (Health has [1,2] and [2,1] as possibilities, [1,1] needs
removed from wild and domestic levels available, respectively)

After all possible level combinations are calculated
Group stat possbilities based on TE and additive stat levels together
Remove any stats that are not in a group```
