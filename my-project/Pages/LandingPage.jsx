import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Target, Zap, Shield, TrendingUp } from "lucide-react";
import { useInView } from "react-intersection-observer";

// Fade-in animation component
const FadeInSection = ({ children, delay = 0 }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-in-out ${
        inView
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-16 scale-95'
      }`}
    >
      {children}
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black ">
      <section className="relative container mx-auto px-4 py-20 md:py-32 bg-white">
  
  <div className="absolute inset-0">
    <img
      src="./images/railway-bg.jpg"
      alt="Railway Background"
      className="w-full h-full object-cover opacity-40"
    />
    <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
  </div>
  <div className="relative z-10 text-center space-y-8">
    <div className="space-y-6">
      <img
        src="images/logo.png"
        alt="RDSO Indian Railways Logo"
        className="mx-auto h-48"
      />
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-black">
        R.D.S.O. 
        <span className="block text-gray-800">DISC Personality Analysis</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
        Our science-backed platform helps individuals and organizations understand behavioral styles, improve
        communication, and build cohesive, high-performing teams.
      </p>
    </div>
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
      <Link to="/details">
        <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-black hover:bg-gray-800 text-white transition-colors duration-300">
          <Users className="mr-2 h-5 w-5" />
          Start Your Assessment
        </Button>
      </Link>
      <Link to="/admin">
        <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold border-2 border-gray-300 hover:bg-gray-100 transition-colors duration-300 bg-transparent text-black bg-slate-50">
          <Shield className="mr-2 h-5 w-5" />
          Access Admin Portal
        </Button>
      </Link>
    </div>
  </div>
</section>

      <section className="bg-slate-100">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <FadeInSection>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">The Four Pillars of the DISC Model</h2>
                <p className="text-lg text-gray-600">A proven framework for understanding human behavior.</p>
              </div>
            </FadeInSection>
            <div className="space-y-6 max-w-2xl mx-auto mb-12">
              <FadeInSection delay={100}>
                <Card className="border-l-4 border-l-black bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader><CardTitle className="text-black flex items-center text-xl"><Target className="mr-3 h-6 w-6" />Dominance (D)</CardTitle></CardHeader>
                  <CardContent><p className="text-gray-700">Measures how you approach problems and challenges. High-D individuals are direct, decisive, and results-oriented, thriving on competition and success.</p></CardContent>
                </Card>
              </FadeInSection>
              <FadeInSection delay={100}>
                <Card className="border-l-4 border-l-black bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader><CardTitle className="text-black flex items-center text-xl"><Zap className="mr-3 h-6 w-6" />Influence (i)</CardTitle></CardHeader>
                  <CardContent><p className="text-gray-700">Examines how you interact with and persuade others. High-i individuals are optimistic, sociable, and enthusiastic, excelling at building networks.</p></CardContent>
                </Card>
              </FadeInSection>
              <FadeInSection delay={100}>
                <Card className="border-l-4 border-l-black bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader><CardTitle className="text-black flex items-center text-xl"><Users className="mr-3 h-6 w-6" />Steadiness (S)</CardTitle></CardHeader>
                  <CardContent><p className="text-gray-700">Reflects your response to pace and consistency. High-S individuals are calm, patient, and reliable, valuing collaboration, stability, and providing support.</p></CardContent>
                </Card>
              </FadeInSection>
              <FadeInSection delay={100}>
                <Card className="border-l-4 border-l-black bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader><CardTitle className="text-black flex items-center text-xl"><BarChart3 className="mr-3 h-6 w-6" />Conscientiousness (C)</CardTitle></CardHeader>
                  <CardContent><p className="text-gray-700">Assesses how you approach rules and procedures. High-C individuals are analytical, precise, and quality-focused, prizing accuracy and order.</p></CardContent>
                </Card>
              </FadeInSection>
            </div>
            <FadeInSection>
              <Card className="bg-black text-white border-0 shadow-lg">
                <CardHeader><CardTitle className="text-2xl text-white">From Questions to Clarity: The Assessment Process</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 leading-relaxed">Our assessment doesn't just label; it illuminates. By analyzing your responses to a series of situational questions, the platform generates a personalized report that uncovers:</p>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start"><span className="text-white mr-3 mt-1">•</span>Your core behavioral drivers and communication tendencies.</li>
                    <li className="flex items-start"><span className="text-white mr-3 mt-1">•</span>Strengths you bring to a team and potential areas for development.</li>
                    <li className="flex items-start"><span className="text-white mr-3 mt-1">•</span>Your ideal work environment and what motivates you to perform your best.</li>
                    <li className="flex items-start"><span className="text-white mr-3 mt-1">•</span>Actionable strategies for collaborating more effectively with other personality types.</li>
                  </ul>
                </CardContent>
              </Card>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-16">An Enterprise-Grade Platform for Modern Teams</h2>
          </FadeInSection>
          <div className="space-y-8 max-w-3xl mx-auto">
            <FadeInSection delay={0}>
              <Card className="border border-gray-200/80 shadow-sm">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-black" />
                  </div>
                  <CardTitle className="text-xl">Actionable Reporting</CardTitle>
                </CardHeader>
                <CardContent><p className="text-gray-600 leading-relaxed">Receive comprehensive, easy-to-understand reports that translate data into practical strategies for individual growth and team development.</p></CardContent>
              </Card>
            </FadeInSection>
            <FadeInSection delay={150}>
              <Card className="border border-gray-200/80 shadow-sm">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-black" />
                  </div>
                  <CardTitle className="text-xl">Centralized Administration</CardTitle>
                </CardHeader>
                <CardContent><p className="text-gray-600 leading-relaxed">Effortlessly manage assessment invitations, monitor candidate progress, and compare profiles from a single, intuitive admin dashboard.</p></CardContent>
              </Card>
            </FadeInSection>
            <FadeInSection delay={300}>
              <Card className="border border-gray-200/80 shadow-sm">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-black" />
                  </div>
                  <CardTitle className="text-xl">Team Dynamics Analysis</CardTitle>
                </CardHeader>
                <CardContent><p className="text-gray-600 leading-relaxed">Visualize your team's collective behavioral style. Identify strengths, communication gaps, and opportunities for improved collaboration.</p></CardContent>
              </Card>
            </FadeInSection>
          </div>
        </div>
      </section>  

      {/* Footer */}
        <footer className="bg-black text-white">
          <div className="container mx-auto px-4 py-16 text-center">
            <h3 className="text-3xl font-bold mb-4 text-white">Building a Smarter, More Cohesive Railway Workforce</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">Our DISC platform provides the clarity needed to unlock potential and drive meaningful results across all departments.</p>
          </div>
        </footer>
    </div>
  );
}
