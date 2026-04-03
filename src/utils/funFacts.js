/**
 * Fun Facts & AI Insights Data
 * ==============================
 * Fun facts: Historically verified football trivia.
 * AI Insights: General football analysis patterns (no fabricated stats).
 *
 * DATA ACCURACY RULES:
 *  - Fun facts are historically verified and well-documented
 *  - AI insights describe general tactical concepts, not specific stats
 *  - No fabricated percentages, fake averages, or estimated numbers
 */

/** Historically verified football facts */
export const FUN_FACTS = [
  {
    text: 'Kylian Mbappé became the youngest French player to score in a World Cup, netting against Peru at age 19 in 2018.',
    highlight: 'Kylian Mbappé',
  },
  {
    text: 'The FIFA World Cup trophy is made of 18-carat gold and weighs 6.1 kg. Only the winning team gets to hold the real one.',
    highlight: '18-carat gold',
  },
  {
    text: 'Lionel Messi holds the record for most Ballon d\'Or awards with 8. Cristiano Ronaldo follows with 5.',
    highlight: '8 Ballon d\'Or awards',
  },
  {
    text: 'The highest-scoring game in football history was AS Adema 149-0 SO l\'Emyrne in 2002. All goals were deliberate own goals in protest.',
    highlight: '149-0',
  },
  {
    text: 'The fastest goal in World Cup history was scored by Hakan Şükür of Turkey in 11 seconds against South Korea in 2002.',
    highlight: '11 seconds',
  },
  {
    text: 'France has won the World Cup twice (1998 and 2018), with Zinedine Zidane and Kylian Mbappé as the iconic stars of each triumph.',
    highlight: 'France',
  },
  {
    text: 'Barcelona\'s La Masia academy has produced more first-team players than any other academy in European football.',
    highlight: 'La Masia',
  },
  {
    text: 'Real Madrid has won a record 15 Champions League/European Cup titles, more than any other club in history.',
    highlight: '15 Champions League titles',
  },
  {
    text: 'The offside rule was introduced in 1863, and it\'s been one of the most debated laws in football ever since.',
    highlight: '1863',
  },
  {
    text: 'Pep Guardiola\'s 2008-09 Barcelona side is widely considered one of the greatest club teams, winning all six trophies in a calendar year.',
    highlight: 'six trophies',
  },
  {
    text: 'The average top-flight footballer runs between 10 and 13 kilometers per match. Midfielders typically cover the most ground.',
    highlight: '10 to 13 kilometers',
  },
  {
    text: 'VAR (Video Assistant Referee) was first used at a FIFA tournament during the 2018 World Cup in Russia.',
    highlight: 'VAR',
  },
  {
    text: 'The Champions League anthem – a rewrite of Handel\'s Zadok the Priest – is sung in English, French and German.',
    highlight: 'Zadok the Priest',
  },
];

/**
 * AI Insights – general analysis patterns
 *
 * IMPORTANT: These describe well-known tactical concepts and trends,
 * NOT specific fabricated statistics. They are labeled as "general
 * football analysis patterns" in the UI.
 */
export const AI_INSIGHTS = [
  {
    icon: '📊',
    label: 'TACTICAL CONCEPT',
    title: 'High Press Systems',
    text: 'Gegenpressing — winning the ball back within seconds of losing it — has become one of the most influential tactical approaches in modern football. Teams that press aggressively tend to create chances in dangerous areas.',
  },
  {
    icon: '⚡',
    label: 'PLAYER PROFILE',
    title: 'Mbappé\'s Playing Style',
    text: 'Kylian Mbappé is known for his explosive pace, intelligent off-ball movement, and ability to stretch defenses. His speed in transition makes him one of the most dangerous counter-attacking threats in world football.',
  },
  {
    icon: '🎯',
    label: 'SET PIECE CONCEPT',
    title: 'Short Corner Routines',
    text: 'Short corner routines have become increasingly popular as an alternative to direct deliveries. They allow the attacking team to create better crossing angles and draw defenders out of position.',
  },
  {
    icon: '🔄',
    label: 'FORMATION ANALYSIS',
    title: 'The 3-4-3 Renaissance',
    text: 'The 3-4-3 formation has seen a resurgence in top European leagues. It offers defensive stability through three center-backs while providing width through wing-backs, though it can limit central midfield options.',
  },
  {
    icon: '📈',
    label: 'ANALYTICS CONCEPT',
    title: 'Expected Goals (xG)',
    text: 'Expected Goals (xG) measures the quality of scoring chances. Teams consistently outperforming their xG may experience regression, while underperformers often have room to improve their results.',
  },
  {
    icon: '🇫🇷',
    label: 'FRANCE PROFILE',
    title: 'Les Bleus Depth',
    text: 'France consistently boasts one of the deepest talent pools in international football. Their ability to produce world-class players across every position has made them perennial contenders at major tournaments.',
  },
  {
    icon: '🧬',
    label: 'SQUAD MANAGEMENT',
    title: 'Injury Impact',
    text: 'Losing multiple key starters simultaneously can significantly impact a team\'s form. Effective squad rotation and depth planning are critical for success across season-long campaigns with congested fixtures.',
  },
  {
    icon: '🏃',
    label: 'PHYSICAL CONCEPT',
    title: 'Speed in Modern Football',
    text: 'Pace remains one of the most valuable attributes in modern football. Players with elite sprint speeds are particularly effective in counter-attacking systems and in exploiting high defensive lines.',
  },
];

/**
 * Get a random fun fact
 * @returns {{ text: string, highlight: string }}
 */
export function getRandomFact() {
  return FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
}

/**
 * Get random AI insights (returns subset)
 * @param {number} count
 * @returns {Array}
 */
export function getRandomInsights(count = 3) {
  const shuffled = [...AI_INSIGHTS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
