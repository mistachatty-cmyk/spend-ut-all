'use client';

import { useMemo, useState } from 'react';
import { achievementCategoryMeta, achievements } from '@/data/achievement-catalog';
import type { AchievementCategory, GameState } from '@/game/types';

const categoryOrder: AchievementCategory[] = ['wealth','scenario','speedrunner','wolf-boss','comeback','spending','income','business','empire','collection','risk','secret'];

export function AchievementsView({ state }: { state: GameState }) {
  const [category, setCategory] = useState<AchievementCategory>('wealth');
  const unlockedIds = new Set(Object.keys(state.runAchievements ?? {}));
  const totalPoints = achievements.reduce((sum, achievement) => sum + (unlockedIds.has(achievement.id) ? achievement.points ?? 0 : 0), 0);
  const visible = useMemo(() => achievements.filter((achievement) => achievement.category === category), [category]);
  const subgroups = useMemo(() => Array.from(new Set(visible.map((achievement) => achievement.subgroup ?? 'General'))), [visible]);

  return <section className="achievements-shell">
    <section className="panel achievement-hero">
      <div><span className="eyebrow">ACHIEVEMENT VAULT</span><h2>{unlockedIds.size}/{achievements.length} unlocked</h2><p>Achievements are permanent for this run once triggered. Timed achievements use active playtime, so closing the game does not ruin a speedrun split.</p></div>
      <div className="achievement-score"><b>{totalPoints.toLocaleString()}</b><span>achievement points</span></div>
    </section>

    <nav className="achievement-categories" aria-label="Achievement categories">
      {categoryOrder.map((id) => {
        const info = achievementCategoryMeta[id];
        const pool = achievements.filter((achievement) => achievement.category === id);
        const earned = pool.filter((achievement) => unlockedIds.has(achievement.id)).length;
        return <button key={id} className={category === id ? 'active' : ''} onClick={() => setCategory(id)}>
          <span>{info.emoji}</span><div><b>{info.name}</b><small>{earned}/{pool.length}</small></div>
        </button>;
      })}
    </nav>

    <section className="panel achievement-category-panel">
      <div className="achievement-category-heading"><span className="achievement-category-icon">{achievementCategoryMeta[category].emoji}</span><div><span className="eyebrow">{achievementCategoryMeta[category].name.toUpperCase()}</span><h2>{achievementCategoryMeta[category].description}</h2></div></div>

      {subgroups.map((subgroup) => {
        const entries = visible.filter((achievement) => (achievement.subgroup ?? 'General') === subgroup);
        const earned = entries.filter((achievement) => unlockedIds.has(achievement.id)).length;
        return <section className="achievement-subgroup" key={subgroup}>
          <header><div><h3>{subgroup}</h3><small>{earned}/{entries.length} complete</small></div><div className="achievement-subgroup-bar"><span style={{ width: `${entries.length ? earned / entries.length * 100 : 0}%` }} /></div></header>
          <div className="achievement-card-grid">
            {entries.map((achievement) => {
              const unlocked = unlockedIds.has(achievement.id);
              const secret = achievement.hidden && !unlocked;
              return <article className={`achievement-vault-card ${unlocked ? 'unlocked' : 'locked'} ${achievement.super ? 'super' : ''}`} key={achievement.id}>
                <span className="achievement-vault-icon">{secret ? '❓' : achievement.emoji}</span>
                <div className="achievement-vault-copy">
                  <div className="achievement-vault-title"><b>{secret ? '???' : achievement.name}</b>{achievement.super ? <em>SUPER</em> : null}</div>
                  <p>{secret ? 'Secret condition. Discover it through unusual play.' : achievement.description}</p>
                  <div className="achievement-tags">
                    <span>{achievement.points ?? 0} pts</span>
                    {achievement.scenarioOnly?.map((scenario) => <span key={scenario}>Scenario · {scenario}</span>)}
                    {unlocked ? <span className="earned-tag">✓ Unlocked</span> : <span>Locked</span>}
                  </div>
                </div>
              </article>;
            })}
          </div>
        </section>;
      })}
    </section>
  </section>;
}
