"use client";

import { useState } from "react";
import SwarmDashboard from "@/components/swarm-dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Issue = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "e-hapur" | "në-proces" | "e-zgjidhur";
  date: string;
  location: string;
};

type Service = {
  id: string;
  name: string;
  description: string;
  contact: string;
  hours: string;
};

type Announcement = {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: "e-lartë" | "mesatare" | "e-ulët";
};

export default function Home() {
  return <SwarmDashboard />;
}

export function LegacyHome() {
  const [issues, setIssues] = useState<Issue[]>([
    {
      id: "1",
      title: "Drita e rrugës nuk funksionon",
      description: "Drita e rrugës në Rrugën Meto Bajraktari është e prishur prej 3 ditësh",
      category: "Infrastrukturë",
      status: "në-proces",
      date: "2026-09-23",
      location: "Rruga Meto Bajraktari"
    },
    {
      id: "2",
      title: "Grumbullim i mbeturinave",
      description: "Kontejnerët pranë Sheshit Çabrati janë plot dhe duhen zbrazur",
      category: "Pastërti",
      status: "e-hapur",
      date: "2026-09-24",
      location: "Sheshi Çabrati"
    },
    {
      id: "3",
      title: "Vrime në rrugë",
      description: "Vrimë e madhe në rrugë që paraqet rrezik për automjetet",
      category: "Rrugë",
      status: "e-zgjidhur",
      date: "2026-09-20",
      location: "Rruga Universiteti"
    }
  ]);

  const [services] = useState<Service[]>([
    {
      id: "1",
      name: "Regjistri Civil",
      description: "Lëshimi i dokumenteve personale, certifikata të lindjes, vdekjes, martesës",
      contact: "Tel: +383 39 123 456",
      hours: "E Hënë - E Premte: 08:00 - 16:00"
    },
    {
      id: "2",
      name: "Departamenti i Urbanizmit",
      description: "Leje ndërtimi, planifikim urban, inspeksione",
      contact: "Tel: +383 39 123 457",
      hours: "E Hënë - E Premte: 08:00 - 15:00"
    },
    {
      id: "3",
      name: "Shërbimi i Pastrimit",
      description: "Menaxhimi i mbeturinave, pastrimi i rrugëve",
      contact: "Tel: +383 39 123 458",
      hours: "24/7 Emergjenca"
    },
    {
      id: "4",
      name: "Drejtoria e Arsimit",
      description: "Çështje arsimore, regjistrimi në shkolla",
      contact: "Tel: +383 39 123 459",
      hours: "E Hënë - E Premte: 08:00 - 16:00"
    }
  ]);

  const [announcements] = useState<Announcement[]>([
    {
      id: "1",
      title: "Ndërprerje e furnizimit me ujë",
      content: "Furnizimi me ujë do të ndërpritet më 26 Shtator nga ora 09:00 deri në 15:00 në lagjen Çabrati për mirëmbajtje.",
      date: "2026-09-25",
      priority: "e-lartë"
    },
    {
      id: "2",
      title: "Hapja e qendrës së re për të rinjtë",
      content: "Me kënaqësi njoftojmë hapjen e qendrës së re për të rinjtë në Rrugën 'Ismail Qemali'. Qendra ofron hapësirë ​​për aktivitete sportive, kulturore dhe edukative.",
      date: "2026-09-24",
      priority: "mesatare"
    },
    {
      id: "3",
      title: "Konsultim publik për parkun e ri",
      content: "Ftojmë qytetarët të marrin pjesë në konsultimin publik për projektimin e parkut të ri në lagjen Piperr, 28 Shtator ora 18:00 në sallën e Komunës.",
      date: "2026-09-23",
      priority: "mesatare"
    }
  ]);

  const [newIssue, setNewIssue] = useState({
    title: "",
    description: "",
    category: "",
    location: ""
  });

  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmitIssue = (e: React.FormEvent) => {
    e.preventDefault();
    const issue: Issue = {
      id: (issues.length + 1).toString(),
      ...newIssue,
      status: "e-hapur",
      date: new Date().toISOString().split('T')[0]
    };
    setIssues([issue, ...issues]);
    setNewIssue({ title: "", description: "", category: "", location: "" });
    alert("Problemi juaj u raportua me sukses!");
  };

  const handleAiQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    setTimeout(() => {
      const responses: Record<string, string> = {
        "si mund të marr certifikatë lindjes": "Për të marrë certifikatë lindjes, duhet të shkoni në Regjistrin Civil me këto dokumente: 1) Letërnjoftim të prindërve, 2) Vërtetim nga spitali. Orari: E Hënë - E Premte, 08:00-16:00. Shërbimi është falas për qytetarët e Gjakovës.",
        "kur pastrohen rrugët": "Shërbimi i pastrimit të rrugëve kryhet çdo ditë në mëngjes nga ora 06:00. Për rrugët sekondare, pastrimi bëhet 3 herë në javë (E Hënë, E Mërkurë, E Premte). Për raportim emergjent, telefononi: +383 39 123 458.",
        "leje ndërtimi": "Për leje ndërtimi, kontaktoni Departamentin e Urbanizmit. Dokumente të nevojshme: 1) Plan i parcelës, 2) Projekt arkitektonik, 3) Vërtetim pronësie. Procesi zgjat 30-45 ditë. Kontakt: +383 39 123 457.",
        "default": `Faleminderit për pyetjen tuaj. Në bazë të informacionit aktual për qytetarët e Gjakovës:\n\nPër shërbime administrative (dokumente, leje, etj.), kontaktoni Regjistrin Civil ose departamentet përkatëse të Komunës gjatë orarit zyrtar.\n\nPër raportim të problemeve urbane, përdorni seksionin "Raporto Problem" në këtë platformë.\n\nPër informacion më të detajuar mbi pyetjen tuaj "${aiQuestion}", ju lutemi kontaktoni drejtpërdrejt komunën në numrin kryesor: +383 39 123 456 ose vizitoni zyrat tona.\n\nGjithashtu, mund të gjeni informacion të dobishëm në seksionin "Shërbimet Komunale" të kësaj platforme.`
      };

      const question = aiQuestion.toLowerCase();
      let response = responses.default;

      for (const key in responses) {
        if (question.includes(key)) {
          response = responses[key];
          break;
        }
      }

      setAiResponse(response);
      setIsProcessing(false);
    }, 1500);
  };

  const getStatusColor = (status: Issue["status"]) => {
    switch (status) {
      case "e-hapur": return "bg-red-500";
      case "në-proces": return "bg-yellow-500";
      case "e-zgjidhur": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: Announcement["priority"]) => {
    switch (priority) {
      case "e-lartë": return "destructive";
      case "mesatare": return "default";
      case "e-ulët": return "secondary";
      default: return "default";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Gjakova Connect</h1>
              <p className="text-sm text-gray-600 mt-1">Platforma Dixhitale për Qytetarët e Gjakovës</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs">
                🤖 AI-Powered
              </Badge>
              <Badge variant="outline" className="text-xs">
                🏛️ Komuna e Gjakovës
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold mb-4">Mirë se vini në platformën tuaj qytetare</h2>
            <p className="text-xl text-blue-100 mb-6">
              Raportoni probleme, aksesoni shërbime komunale, dhe qëndroni të informuar për ngjarjet në komunitetin tuaj. 
              E gjitha në një vend, me mbështetje nga inteligjenca artificiale.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" variant="secondary" className="bg-white text-blue-900 hover:bg-blue-50">
                    📢 Raporto Problem
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Raporto një Problem</DialogTitle>
                    <DialogDescription>
                      Ndani me ne problemet që keni vërejtur në komunitetin tuaj
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmitIssue} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Titulli</label>
                      <Input
                        placeholder="p.sh. Drita e rrugës nuk funksionon"
                        value={newIssue.title}
                        onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Kategoria</label>
                      <Input
                        placeholder="p.sh. Infrastrukturë, Pastërti, Rrugë"
                        value={newIssue.category}
                        onChange={(e) => setNewIssue({ ...newIssue, category: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Lokacioni</label>
                      <Input
                        placeholder="p.sh. Rruga Meto Bajraktari"
                        value={newIssue.location}
                        onChange={(e) => setNewIssue({ ...newIssue, location: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Përshkrimi</label>
                      <Textarea
                        placeholder="Përshkruani problemin në detaje..."
                        value={newIssue.description}
                        onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                        required
                        rows={4}
                      />
                    </div>
                    <Button type="submit" className="w-full">Dërgo Raportin</Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button size="lg" variant="outline" className="bg-blue-700 border-white text-white hover:bg-blue-600">
                💬 Asistenti AI
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="announcements" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="announcements">📰 Njoftime</TabsTrigger>
            <TabsTrigger value="issues">📋 Problemet</TabsTrigger>
            <TabsTrigger value="services">🏛️ Shërbimet</TabsTrigger>
            <TabsTrigger value="ai">🤖 AI Asistent</TabsTrigger>
          </TabsList>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Njoftime dhe Lajme</h3>
              <p className="text-gray-600 mb-6">Informacione të rëndësishme për komunitetin</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {announcements.map((announcement) => (
                <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      <Badge variant={getPriorityColor(announcement.priority)}>
                        {announcement.priority}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">{announcement.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{announcement.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Issues Tab */}
          <TabsContent value="issues" className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold mb-2">Problemet e Raportuara</h3>
                <p className="text-gray-600 mb-6">Gjurmo statusin e problemeve në komunitet</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>+ Raporto Problem të Ri</Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Raporto një Problem</DialogTitle>
                    <DialogDescription>
                      Ndani me ne problemet që keni vërejtur në komunitetin tuaj
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmitIssue} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Titulli</label>
                      <Input
                        placeholder="p.sh. Drita e rrugës nuk funksionon"
                        value={newIssue.title}
                        onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Kategoria</label>
                      <Input
                        placeholder="p.sh. Infrastrukturë, Pastërti, Rrugë"
                        value={newIssue.category}
                        onChange={(e) => setNewIssue({ ...newIssue, category: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Lokacioni</label>
                      <Input
                        placeholder="p.sh. Rruga Meto Bajraktari"
                        value={newIssue.location}
                        onChange={(e) => setNewIssue({ ...newIssue, location: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Përshkrimi</label>
                      <Textarea
                        placeholder="Përshkruani problemin në detaje..."
                        value={newIssue.description}
                        onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                        required
                        rows={4}
                      />
                    </div>
                    <Button type="submit" className="w-full">Dërgo Raportin</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {issues.map((issue) => (
                <Card key={issue.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg">{issue.title}</CardTitle>
                      <Badge className={getStatusColor(issue.status)}>
                        {issue.status}
                      </Badge>
                    </div>
                    <CardDescription className="space-y-1">
                      <div className="text-xs">📍 {issue.location}</div>
                      <div className="text-xs">📁 {issue.category} • {issue.date}</div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{issue.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Shërbimet Komunale</h3>
              <p className="text-gray-600 mb-6">Gjeni informacion për shërbimet e Komunës së Gjakovës</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {services.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">📞 Kontakt:</span>
                      <span className="text-blue-600">{service.contact}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">🕒 Orari:</span>
                      <span>{service.hours}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AI Assistant Tab */}
          <TabsContent value="ai" className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Asistenti AI për Qytetarët</h3>
              <p className="text-gray-600 mb-6">Bëni pyetje mbi shërbimet komunale dhe merrni përgjigje të menjëhershme</p>
            </div>
            <div className="max-w-3xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>💬 Si mund t'ju ndihmoj sot?</CardTitle>
                  <CardDescription>
                    Pyetni mbi çdo shërbim komunal, dokumente, orare, ose procedura administrative
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleAiQuestion} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Pyetja juaj</label>
                      <Textarea
                        placeholder="P.sh. Si mund të marr certifikatë lindjes? Kur pastrohen rrugët? Si të aplikoj për leje ndërtimi?"
                        value={aiQuestion}
                        onChange={(e) => setAiQuestion(e.target.value)}
                        required
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                    <Button type="submit" disabled={isProcessing} className="w-full">
                      {isProcessing ? "Po përpunohet..." : "Dërgo Pyetjen"}
                    </Button>
                  </form>

                  {aiResponse && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">🤖</div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2 text-blue-900">Përgjigja:</h4>
                          <p className="text-sm text-gray-800 whitespace-pre-line">{aiResponse}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4 mt-6">
                    <h4 className="font-semibold mb-3 text-sm">Pyetje të Shpeshta:</h4>
                    <div className="grid gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start text-left h-auto py-2 px-3"
                        onClick={() => setAiQuestion("Si mund të marr certifikatë lindjes?")}
                      >
                        💼 Si mund të marr certifikatë lindjes?
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start text-left h-auto py-2 px-3"
                        onClick={() => setAiQuestion("Kur pastrohen rrugët?")}
                      >
                        🧹 Kur pastrohen rrugët në lagjen time?
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start text-left h-auto py-2 px-3"
                        onClick={() => setAiQuestion("Si të aplikoj për leje ndërtimi?")}
                      >
                        🏗️ Si të aplikoj për leje ndërtimi?
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-3">Gjakova Connect</h4>
              <p className="text-gray-400 text-sm">
                Platforma dixhitale për të përmirësuar komunikimin midis qytetarëve dhe Komunës së Gjakovës.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3">Kontakt</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>📞 Tel: +383 39 123 456</p>
                <p>✉️ Email: info@komuna-gjakove.org</p>
                <p>📍 Adresa: Sheshi Çabrati, Gjakovë</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3">Orari</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>E Hënë - E Premte</p>
                <p>08:00 - 16:00</p>
                <p className="mt-3 text-xs text-gray-500">
                  © 2026 Komuna e Gjakovës. Të gjitha të drejtat e rezervuara.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-sm text-gray-500">
              🏆 Zhvilluar për Ai4Society Hackathon - Tiranë 2026 | Organizuar nga BONEVET
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
