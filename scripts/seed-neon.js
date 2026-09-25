const { neon } = require('@neondatabase/serverless');
const data = require('../src/seed-data');

const url = process.env.DATABASE_URL || 'postgresql://authenticator:npg_5jQsApY3zWoU@ep-empty-moon-b3tjbpps-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(url);

async function run() {
  console.log('--- Seeding Neon Database via Serverless HTTP Driver ---');

  // 1. Site Settings
  const s = data.settings;
  const cols = Object.keys(s);
  const placeholders = cols.map((_, i) => '$' + (i + 1)).join(', ');
  const setClause = cols.map((c, i) => `${c} = $${i + 1}`).join(', ');
  const vals = cols.map((c) => s[c]);

  await sql(
    `INSERT INTO site_settings (id, ${cols.join(', ')}) VALUES (1, ${placeholders}) ON CONFLICT (id) DO UPDATE SET ${setClause}`,
    vals
  );
  console.log('✔ Seeded site_settings');

  // Helper for simple tables
  async function seedTable(table, rows, columns) {
    if (!rows || !rows.length) return;
    await sql(`DELETE FROM ${table}`);
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowValues = [i, ...columns.map((c) => row[c])];
      const ph = rowValues.map((_, idx) => `$${idx + 1}`).join(', ');
      await sql(`INSERT INTO ${table} (sort_order, ${columns.join(', ')}) VALUES (${ph})`, rowValues);
    }
    console.log(`✔ Seeded ${table} (${rows.length} rows)`);
  }

  await seedTable('research_interests', data.researchInterests, ['icon', 'topic', 'description']);
  await seedTable('spoken_languages', data.spokenLanguages, ['name', 'level']);
  await seedTable('teaching_roles', data.teachingRoles, ['title', 'description']);
  await seedTable('teaching_areas', data.teachingAreas, ['topic', 'description']);
  await seedTable('education', data.education, ['degree', 'major', 'institution', 'year', 'grade']);
  await seedTable('experience', data.experience, ['title', 'org', 'period', 'bullets']);
  await seedTable('publications', data.publications, ['type', 'status', 'title', 'authors', 'venue', 'year', 'abstract', 'doi_link', 'pdf_link']);
  await seedTable('projects', data.projects, ['category', 'title', 'description', 'tech', 'year', 'github_link', 'paper_link', 'featured']);
  await seedTable('certifications', data.certifications, ['title', 'issuer', 'year', 'image', 'verify_link', 'pdf_link']);
  await seedTable('awards', data.awards, ['title', 'org', 'year', 'image']);
  await seedTable('activities', data.activities, ['text']);
  await seedTable('courses', data.courses, ['name', 'institution', 'period', 'role']);
  await seedTable('blog_posts', data.blog, ['title', 'slug', 'date', 'read_time', 'category', 'excerpt', 'content', 'featured']);
  await seedTable('reference_list', data.references, ['name', 'role', 'org', 'note', 'phone', 'email']);
  if (data.spotlights) {
    await seedTable('spotlights', data.spotlights, ['badge', 'badge_type', 'title', 'description', 'tag', 'image', 'link_url', 'link_label']);
  }

  // 2. Gallery
  await sql('DELETE FROM gallery_photos');
  await sql('DELETE FROM gallery_events');
  if (data.gallery) {
    for (let i = 0; i < data.gallery.length; i++) {
      const ev = data.gallery[i];
      const res = await sql(
        'INSERT INTO gallery_events (sort_order, title, year) VALUES ($1, $2, $3) RETURNING id',
        [i, ev.title, String(ev.year || '')]
      );
      const evId = res[0].id;
      for (let j = 0; j < (ev.photos || []).length; j++) {
        const ph = ev.photos[j];
        await sql(
          'INSERT INTO gallery_photos (sort_order, event_id, src, caption) VALUES ($1, $2, $3, $4)',
          [j, evId, ph.src || '', ph.caption || '']
        );
      }
    }
    console.log(`✔ Seeded gallery (${data.gallery.length} events)`);
  }

  console.log('--- ALL REAL DATA SEEDED SUCCESSFULLY! ---');
}

run().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
