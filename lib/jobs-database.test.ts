import { describe, expect, it } from 'vitest';
import { getJob, getJobsByFamily, JOBS } from './jobs-database';

describe('jobs-database', () => {
  it('returns the 5 marketing jobs', () => {
    const jobs = getJobsByFamily('marketing');
    expect(jobs).toHaveLength(5);
    const names = jobs.map((j) => j.name);
    expect(names).toContain('Brand Manager');
    expect(names).toContain('Growth Marketer');
  });

  it('returns nothing for not-yet-populated families', () => {
    expect(getJobsByFamily('finance')).toEqual([]);
    expect(getJobsByFamily('strategy')).toEqual([]);
  });

  it('every job has a non-empty journeeType', () => {
    for (const job of JOBS) {
      expect(job.journeeType.length).toBeGreaterThan(0);
    }
  });

  it('getJob returns the right one', () => {
    expect(getJob('brand-manager')?.name).toBe('Brand Manager');
    expect(getJob('does-not-exist')).toBeUndefined();
  });

  it('every job id is unique', () => {
    const ids = JOBS.map((j) => j.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
