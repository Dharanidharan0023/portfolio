const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const profile = await prisma.profile.create({
    data: {
      fullName: 'Admin User',
      title: 'Full Stack Developer',
      bio: 'Passionate developer building amazing web applications.',
      avatarUrl: '',
      resumeUrl: '',
      leadershipTitle: '',
      leadershipBio: ''
    }
  });

  const about = await prisma.about.create({
    data: {
      description: 'I am a highly motivated software engineer with experience in React, Node.js, and modern web technologies.',
      highlights: '["React", "Node.js", "TypeScript", "NestJS", "Tailwind CSS"]'
    }
  });

  console.log('Profile created:', profile);
  console.log('About created:', about);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
