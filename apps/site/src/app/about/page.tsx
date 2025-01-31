import { PersonCard } from "./_components/person-card";
import { founders, teamMembers, technicalAdvisors } from "./_lib/data";

export default function Page() {
  return (
    <main className="container mx-auto">
      <div className="flex items-start flex-col justify-center py-10">
        <h1 className="text-4xl font-bold text-center mb-12">About Us</h1>
        <section className="mb-16">
          <div className="space-y-8">
            {founders.map((founder) => (
              <PersonCard key={founder.name} {...founder} />
            ))}
          </div>
        </section>
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8">Our Team</h2>
          <div className="space-y-8">
            {teamMembers.map((member) => (
              <PersonCard key={member.name} {...member} />
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-3xl font-semibold mb-8">Our Technical Advisors</h2>
          <div className="space-y-8">
            {technicalAdvisors.map((member) => (
              <PersonCard key={member.name} {...member} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
