import AnjanaDhilipKrishna from "@/lib/images/anjana-dhilip-krishna.jpeg";
import PradeepSampath from "@/lib/images/pradeep-sampath.jpeg";
import SitaPradeep from "@/lib/images/sita-pradeep.jpeg";
import Image from "next/image";

export const founders = [
  {
    name: "Anjana Dhilip Krishna",
    role: "Founder",
    description:
      "A Convergence of Engineering Acumen, Entrepreneurial Success, HR Expertise, and Psychological Insight. Her project at IIT Madras to solve bird hits at airports was a testament to her innovative problem-solving skills and engineering expertise. As a Master's in Psychology, she is also a member of the American Psychological Association (APA).",
    image: (
      <Image
        src={AnjanaDhilipKrishna}
        alt="Anjana Dhilip Krishna"
        width={300}
        height={300}
        className="object-cover w-full h-full"
      />
    ),
  },
  {
    name: "Pradeep Sampath",
    role: "Co-Founder",
    description:
      "Pradeep Sampath is a serial entrepreneur with over 4 decades of entrepreneurial experience. His company AS Industries is a prominent manufacturer in the welding electrode industry.",
    image: (
      <Image
        src={PradeepSampath}
        alt="Pradeep Sampath"
        width={300}
        height={300}
        className="object-cover w-full h-full"
      />
    ),
  },
  {
    name: "Sita Pradeep",
    role: "Co-Founder",
    description: "Sita Pradeep, M. Sc Chemistry from Meenakshi Sundararajan College, Chennai.",
    image: (
      <Image src={SitaPradeep} alt="Sita Pradeep" width={300} height={300} className="object-cover w-full h-full" />
    ),
  },
];

export const teamMembers = [
  {
    name: "Vishwath Parthasarathy",
    role: "Chief Technology Officer",
    description:
      "Vishwath is a distinguished AI expert with over 8 years of experience focusing on harnessing advanced machine learning and deep learning to tackle real world customer challenges. As a consultant in various startups, he has demonstrated a profound commitment to leveraging data driven solutions to streamline business operations.",
    image: (
      <Image
        src="/placeholder.svg"
        alt="Vishwath Parthasarathy"
        width={300}
        height={300}
        className="object-cover w-full h-full"
      />
    ),
  },
];
