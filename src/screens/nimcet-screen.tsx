'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useStore, TestResult, TopicStatus, RevisionTask } from '@/lib/store'
import { Plus, Check, History, TrendingUp, Target as TargetIcon, BookOpen, Calendar, Clock } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { format, formatDistanceToNow, isPast } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// MOCK data for tests, as it's not the focus of the current task.
const MOCK_TEST_RESULTS: TestResult[] = [
    { id: '1', testName: 'Full Mock #1', date: '2026-02-15', timeTaken: 120, totalScore: 480, score: 320, subjectScores: { 'Mathematics': 80, 'Logical Reasoning': 60 }, chapterScores: {} },
    { id: '2', testName: 'Full Mock #2', date: '2026-03-01', timeTaken: 115, totalScore: 480, score: 350, subjectScores: { 'Mathematics': 90, 'Logical Reasoning': 65 }, chapterScores: {} },
];

export function NimcetScreen() {
    const topics = useStore((state) => state.topics) || [];
    const revisionTasks = useStore((state) => state.revisionTasks) || [];
    const updateTopicStatus = useStore((state) => state.updateTopicStatus);
    const updateRevisionTask = useStore((state) => state.updateRevisionTask);

    const [testResults, setTestResults] = useState(MOCK_TEST_RESULTS);

    const groupedSyllabus = useMemo(() => {
        const subjectMap = new Map<string, Map<string, TopicStatus[]>>();
        (topics || []).forEach(topic => {
            if (!subjectMap.has(topic.subject)) subjectMap.set(topic.subject, new Map<string, TopicStatus[]>());
            const chapterMap = subjectMap.get(topic.subject)!;
            if (!chapterMap.has(topic.chapter)) chapterMap.set(topic.chapter, []);
            chapterMap.get(topic.chapter)!.push(topic);
        });
        return Array.from(subjectMap.entries()).map(([subjectName, chapterMap], i) => ({
            id: `subj-${i}`, name: subjectName,
            chapters: Array.from(chapterMap.entries()).map(([chapterName, topics], j) => ({
                id: `chap-${i}-${j}`, name: chapterName, topics,
            })),
        }));
    }, [topics]);

    const { upcomingRevisions, completedRevisions } = useMemo(() => {
        const safeRevisionTasks = revisionTasks || [];
        const upcoming = safeRevisionTasks
            .filter(t => t.status === 'pending')
            .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());
        const completed = safeRevisionTasks
            .filter(t => t.status === 'done')
            .sort((a, b) => new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime());
        return { upcomingRevisions: upcoming, completedRevisions: completed };
    }, [revisionTasks]);

    const calculateProgress = (items: { status: TopicStatus['status'] }[]) => {
        if (items.length === 0) return 0;
        const completedWeight = { 'Not Started': 0, 'In Progress': 0.25, 'Practiced': 0.75, 'Revised': 1 };
        const totalWeight = items.reduce((acc, item) => acc + (completedWeight[item.status] || 0), 0);
        return (totalWeight / items.length) * 100;
    };

    const handleAddTest = (test: Omit<TestResult, 'id'>) => {
        const newTest = { ...test, id: crypto.randomUUID() };
        setTestResults(prev => [...prev, newTest]);
    };

    return (
        <div className="space-y-6">
            <Tabs defaultValue="syllabus">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
                    <TabsTrigger value="mock-tests">Mock Tests</TabsTrigger>
                    <TabsTrigger value="revision">Revision Plan</TabsTrigger>
                </TabsList>

                <TabsContent value="syllabus" className="mt-4 space-y-4">
                    <Card className="glass-card border-0">
                        <CardHeader>
                            <CardTitle>NIMCET Syllabus Tracker</CardTitle>
                            <CardDescription>Mark a topic as 'Revised' to automatically schedule it for spaced repetition.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="multiple" className="w-full">
                                {groupedSyllabus.map(subject => (
                                    <AccordionItem value={subject.id} key={subject.id}>
                                        <AccordionTrigger>
                                            <div className="flex-1 text-left"><div className="font-semibold">{subject.name}</div>
                                                <Progress value={calculateProgress(subject.chapters.flatMap(c => c.topics))} className="w-full h-2 mt-1" />
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pl-4 space-y-2">
                                            {subject.chapters.map(chapter => (
                                                <Card key={chapter.id} className="bg-muted/30">
                                                    <CardHeader className="p-3">
                                                        <h4 className="font-medium">{chapter.name}</h4>
                                                        <Progress value={calculateProgress(chapter.topics)} className="w-full h-1 mt-1" />
                                                    </CardHeader>
                                                    <CardContent className="p-3 pt-0 space-y-2">
                                                        {chapter.topics.map(topic => (
                                                            <div key={topic.id} className="flex items-center justify-between p-2 bg-background rounded-md">
                                                                <span className="text-sm">{topic.topic}</span>
                                                                <Select value={topic.status} onValueChange={(newStatus: TopicStatus['status']) => updateTopicStatus(topic.id, newStatus)}>
                                                                    <SelectTrigger className="w-[140px] h-8"><SelectValue /></SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="Not Started">Not Started</SelectItem>
                                                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                                                        <SelectItem value="Practiced">Practiced</SelectItem>
                                                                        <SelectItem value="Revised">Revised</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        ))}
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="mock-tests" className="space-y-6">
                    <div className="flex justify-end"><MockTestForm onSubmit={handleAddTest} /></div>
                    <ScoreProgressionChart testResults={testResults} />
                    <SubjectWeaknessChart testResults={testResults} />
                </TabsContent>

                <TabsContent value="revision" className="space-y-6">
                    <Card className="glass-card border-0">
                        <CardHeader><CardTitle>Upcoming Revisions</CardTitle></CardHeader>
                        <CardContent>
                            {upcomingRevisions.length > 0 ? (
                                <div className="space-y-3">
                                    {upcomingRevisions.map(task => <RevisionTaskItem key={task.id} task={task} onUpdate={updateRevisionTask} />)}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground"><Calendar className="mx-auto h-12 w-12" /><p className="mt-4">No upcoming revisions. Mark a topic as 'Revised' to get started!</p></div>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="glass-card border-0">
                        <CardHeader><CardTitle>Revision History</CardTitle></CardHeader>
                        <CardContent>
                            {completedRevisions.length > 0 ? (
                                <div className="space-y-3">
                                    {completedRevisions.slice(0, 10).map(task => <RevisionTaskItem key={task.id} task={task} onUpdate={updateRevisionTask} />)}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground"><History className="mx-auto h-12 w-12" /><p className="mt-4">No revision history yet.</p></div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

const RevisionTaskItem = ({ task, onUpdate }: { task: RevisionTask; onUpdate: (id: string, updates: Partial<RevisionTask>) => void }) => {
    const isDue = isPast(new Date(task.scheduledFor));
    return (
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="flex-1">
                <p className="font-semibold">{task.topicName}</p>
                <p className="text-xs text-muted-foreground">{task.subjectName} &gt; {task.chapterName}</p>
            </div>
            <Badge variant={isDue ? 'default' : 'outline'} className="hidden sm:inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(task.scheduledFor), { addSuffix: true })}
            </Badge>
            {task.status === 'pending' && (
                <Button size="sm" onClick={() => onUpdate(task.id, { status: 'done' })}><Check className="h-4 w-4 mr-2" /> Mark Done</Button>
            )}
            {task.status === 'done' && (
                <div className="flex items-center gap-2 text-green-600 font-medium">
                    <Check className="h-5 w-5" />
                    <span>Done</span>
                </div>
            )}
        </div>
    );
};

const MockTestForm = ({ onSubmit }: { onSubmit: (data: Omit<TestResult, 'id'>) => void }) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [score, setScore] = useState('');
    const [totalScore, setTotalScore] = useState('');
    const [timeTaken, setTimeTaken] = useState('');
    const [subjectScores, setSubjectScores] = useState<{ name: string, score: string }[]>([{ name: '', score: '' }]);

    const handleAddSubject = () => setSubjectScores([...subjectScores, { name: '', score: '' }]);
    const handleSubjectChange = (index: number, field: 'name' | 'score', value: string) => {
        const newScores = [...subjectScores];
        newScores[index][field] = value;
        setSubjectScores(newScores);
    };

    const handleSubmit = () => {
        const finalSubjectScores: Record<string, number> = {};
        subjectScores.forEach(s => { if (s.name && s.score) finalSubjectScores[s.name] = Number(s.score); });
        onSubmit({ testName: name, date, score: Number(score), totalScore: Number(totalScore), timeTaken: Number(timeTaken), subjectScores: finalSubjectScores, chapterScores: {}, });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Log Mock Test</Button></DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Log New Mock Test</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-1"><Label>Test Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Full Mock #3" /></div>
                    <div className="space-y-1"><Label>Date</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><Label>Your Score</Label><Input type="number" value={score} onChange={e => setScore(e.target.value)} /></div>
                        <div className="space-y-1"><Label>Total Marks</Label><Input type="number" value={totalScore} onChange={e => setTotalScore(e.target.value)} /></div>
                    </div>
                    <div className="space-y-1"><Label>Time Taken (minutes)</Label><Input type="number" value={timeTaken} onChange={e => setTimeTaken(e.target.value)} /></div>
                    <div className="space-y-2 pt-4 border-t"><Label className="font-semibold">Subject-wise Scores</Label>
                        {subjectScores.map((s, i) => (<div key={i} className="grid grid-cols-2 gap-2"><Input placeholder="Subject Name" value={s.name} onChange={e => handleSubjectChange(i, 'name', e.target.value)} /><Input type="number" placeholder="Score" value={s.score} onChange={e => handleSubjectChange(i, 'score', e.target.value)} /></div>))}
                        <Button variant="outline" size="sm" onClick={handleAddSubject} className="w-full">Add Subject Score</Button>
                    </div>
                </div>
                <DialogFooter><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={handleSubmit}>Save Result</Button></DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const ScoreProgressionChart = ({ testResults }: { testResults: TestResult[] }) => {
    const chartData = testResults.map(t => ({ date: format(new Date(t.date), 'MMM d'), percentage: Number(((t.score / t.totalScore) * 100).toFixed(1)), })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return (<Card className="glass-card border-0"><CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Score Progression (%)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><LineChart data={chartData}><XAxis dataKey="date" stroke="#888888" fontSize={12} /><YAxis domain={[0, 100]} stroke="#888888" fontSize={12} /><Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} /><Legend /><Line type="monotone" dataKey="percentage" stroke="hsl(var(--primary))" strokeWidth={2} name="Score" /></LineChart></ResponsiveContainer></CardContent></Card>)
};

const SubjectWeaknessChart = ({ testResults }: { testResults: TestResult[] }) => {
    const subjectAverages = useMemo(() => {
        const scores: Record<string, { total: number, count: number }> = {};
        testResults.forEach(test => { Object.entries(test.subjectScores).forEach(([subject, score]) => { if (!scores[subject]) scores[subject] = { total: 0, count: 0 }; scores[subject].total += score; scores[subject].count += 1; }); });
        return Object.entries(scores).map(([name, data]) => ({ name, average: Number((data.total / data.count).toFixed(1)), })).sort((a, b) => a.average - b.average);
    }, [testResults]);
    return (<Card className="glass-card border-0"><CardHeader><CardTitle className="flex items-center gap-2"><TargetIcon className="h-5 w-5" />Average Score by Subject</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><BarChart data={subjectAverages} layout="vertical"><XAxis type="number" domain={[0, 100]} stroke="#888888" fontSize={12} /><YAxis type="category" dataKey="name" stroke="#888888" fontSize={12} width={100} /><Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} /><Bar dataKey="average" name="Average Score" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>);
};
