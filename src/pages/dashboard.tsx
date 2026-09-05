import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  Circle,
  CircleDot,
  ClipboardList,
  Filter,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Target,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';

type Status = 'todo' | 'in-progress' | 'done';
type Priority = 'low' | 'medium' | 'high';

type Task = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: string;
  dueDate: string;
  comments: string[];
};

type Project = {
  id: string;
  name: string;
  description: string;
  color: string;
  dueDate: string;
};

type ActivityItem = { id: string; text: string; time: string; color: string };

const seedProjects: Project[] = [
  { id: 'launch', name: 'Website launch', description: 'Refresh the marketing site and ship the new story.', color: '#5B3DF0', dueDate: '2026-09-12' },
  { id: 'mobile', name: 'Mobile experience', description: 'Make the core workflow delightful on every screen.', color: '#FF6650', dueDate: '2026-09-28' },
  { id: 'research', name: 'Customer research', description: 'Turn conversations into a sharper product direction.', color: '#0E8F6C', dueDate: '2026-10-04' },
];

const seedTasks: Task[] = [
  { id: 't1', projectId: 'launch', title: 'Review the homepage copy', description: 'Tighten the hero message and make the next step obvious.', status: 'done', priority: 'high', assignee: 'Ayesha', dueDate: '2026-08-22', comments: ['The second draft is ready for a final pass.'] },
  { id: 't2', projectId: 'launch', title: 'Prepare launch checklist', description: 'Capture owners, links, and the go-live sequence.', status: 'in-progress', priority: 'medium', assignee: 'Hamza', dueDate: '2026-08-25', comments: [] },
  { id: 't3', projectId: 'launch', title: 'Create social launch assets', description: 'Export the launch announcement in three sizes.', status: 'todo', priority: 'low', assignee: 'Mariam', dueDate: '2026-08-29', comments: [] },
  { id: 't4', projectId: 'mobile', title: 'Map the onboarding flow', description: 'Document the happy path and empty states.', status: 'in-progress', priority: 'high', assignee: 'Ayesha', dueDate: '2026-09-02', comments: ['Add the returning-user case too.'] },
  { id: 't5', projectId: 'mobile', title: 'Test navigation patterns', description: 'Compare the top navigation options on small screens.', status: 'todo', priority: 'medium', assignee: 'Omar', dueDate: '2026-09-05', comments: [] },
  { id: 't6', projectId: 'research', title: 'Schedule five interviews', description: 'Reach out to active customers and book 30-minute calls.', status: 'done', priority: 'high', assignee: 'Mariam', dueDate: '2026-08-20', comments: [] },
];

const names = ['Ayesha', 'Hamza', 'Mariam', 'Omar'];
const statusLabels: Record<Status, string> = { todo: 'To do', 'in-progress': 'In progress', done: 'Done' };
const priorityLabels: Record<Priority, string> = { low: 'Low', medium: 'Medium', high: 'High' };

function load<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map((part) => part[0]).join('') || 'U').toUpperCase();
}

function timeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const scope = user?.email ?? 'guest';

  const [projects, setProjects] = useState<Project[]>(() => load(`pm-projects:${scope}`, seedProjects));
  const [tasks, setTasks] = useState<Task[]>(() => load(`pm-tasks:${scope}`, seedTasks));
  const [activity, setActivity] = useState<ActivityItem[]>(() => load(`pm-activity:${scope}`, [
    { id: 'a1', text: 'Ayesha completed Review the homepage copy', time: '12 min ago', color: '#5B3DF0' },
    { id: 'a2', text: 'Hamza moved Prepare launch checklist to In progress', time: '44 min ago', color: '#C07A0E' },
    { id: 'a3', text: 'Mariam created a new research milestone', time: '2 hrs ago', color: '#0E8F6C' },
  ]));
  const [view, setView] = useState<'overview' | 'projects'>('overview');
  const [selectedId, setSelectedId] = useState('launch');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | Status>('all');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => localStorage.setItem(`pm-projects:${scope}`, JSON.stringify(projects)), [projects, scope]);
  useEffect(() => localStorage.setItem(`pm-tasks:${scope}`, JSON.stringify(tasks)), [tasks, scope]);
  useEffect(() => localStorage.setItem(`pm-activity:${scope}`, JSON.stringify(activity)), [activity, scope]);

  const selected = projects.find((project) => project.id === selectedId) ?? projects[0];
  const projectTasks = tasks.filter((task) => task.projectId === selected?.id);
  const visibleTasks = projectTasks.filter((task) => {
    const matchesQuery = `${task.title} ${task.description} ${task.assignee}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (filter === 'all' || task.status === filter);
  });
  const doneCount = projectTasks.filter((task) => task.status === 'done').length;
  const progress = projectTasks.length ? Math.round((doneCount / projectTasks.length) * 100) : 0;
  const totals = useMemo(() => ({
    all: tasks.length,
    done: tasks.filter((task) => task.status === 'done').length,
    active: tasks.filter((task) => task.status !== 'done').length,
  }), [tasks]);

  function addActivity(text: string, color = '#5B3DF0') {
    setActivity((items) => [{ id: crypto.randomUUID(), text, time: 'just now', color }, ...items].slice(0, 8));
  }

  function updateStatus(task: Task, status: Status) {
    setTasks((items) => items.map((item) => (item.id === task.id ? { ...item, status } : item)));
    addActivity(`${task.assignee} moved ${task.title} to ${statusLabels[status]}`);
  }

  function saveTask(data: Omit<Task, 'id' | 'comments'> & { id?: string; comments?: string[] }) {
    if (data.id) {
      setTasks((items) => items.map((item) => (item.id === data.id ? { ...item, ...data, comments: data.comments ?? item.comments } : item)));
      addActivity(`Task updated: ${data.title}`);
    } else {
      setTasks((items) => [...items, { ...data, id: crypto.randomUUID(), comments: [] }]);
      addActivity(`New task created: ${data.title}`);
    }
    setShowTaskForm(false);
    setEditingTask(null);
  }

  function addProject(data: Omit<Project, 'id'>) {
    const project = { ...data, id: crypto.randomUUID() };
    setProjects((items) => [...items, project]);
    setSelectedId(project.id);
    setView('projects');
    setShowProjectForm(false);
    addActivity(`New project created: ${project.name}`, project.color);
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'open' : ''}`}>
        <Link to="/" className="brand"><span className="brand-mark"><Sparkles size={16} /></span><span>taskflow</span></Link>
        <div className="workspace-switch"><span className="workspace-avatar">T</span><span><b>Team workspace</b><small>Personal space</small></span><ChevronDown size={15} /></div>
        <nav>
          <p className="nav-label">Workspace</p>
          <button className={view === 'overview' ? 'nav-item active' : 'nav-item'} onClick={() => { setView('overview'); setMobileNav(false); }}><LayoutDashboard size={17} /> Overview</button>
          <button className={view === 'projects' ? 'nav-item active' : 'nav-item'} onClick={() => { setView('projects'); setMobileNav(false); }}><ClipboardList size={17} /> Projects <span className="nav-count">{projects.length}</span></button>
          <button className="nav-item" onClick={() => { setView('projects'); setFilter('in-progress'); setMobileNav(false); }}><CircleDot size={17} /> My tasks <span className="nav-count">{totals.active}</span></button>
          <p className="nav-label spaced">Manage</p>
          <button className="nav-item"><Users size={17} /> Team</button>
          <button className="nav-item"><Settings2 size={17} /> Settings</button>
        </nav>
        <div className="sidebar-bottom">
          <div className="upgrade-card"><span className="upgrade-icon"><Target size={17} /></span><b>Make progress visible</b><p>Keep the whole team moving in one place.</p></div>
          <div className="user-row">
            <span className="user-avatar">{initials(user?.name ?? 'You')}</span>
            <span><b>{user?.name ?? 'You'}</b><small>{user?.email}</small></span>
            <button className="logout-icon" onClick={handleLogout} title="Log out" aria-label="Log out"><LogOut size={16} /></button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)}><Menu size={20} /></button><div className="breadcrumb"><span>Team workspace</span><span>/</span><b>{view === 'overview' ? 'Overview' : selected?.name}</b></div><div className="top-actions"><div className="top-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks..." /></div><button className="icon-button"><Bell size={18} /><i /></button><button className="avatar-button">{initials(user?.name ?? 'You')}</button></div></header>
        {view === 'overview' ? (
          <section className="page">
            <div className="page-heading"><div><p className="eyebrow">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p><h1>{timeGreeting()}, {(user?.name ?? 'there').split(' ')[0]}</h1><p className="subheading">Here is what is happening across your workspace.</p></div><button className="primary-button" onClick={() => setShowProjectForm(true)}><Plus size={17} /> New project</button></div>
            <div className="metric-grid"><Metric icon={<ClipboardList />} label="Total tasks" value={totals.all} note={`${totals.active} still active`} tone="purple" /><Metric icon={<CircleDot />} label="In progress" value={tasks.filter((task) => task.status === 'in-progress').length} note="Across all projects" tone="orange" /><Metric icon={<Check />} label="Completed" value={totals.done} note="Nice work this week" tone="green" /><Metric icon={<CalendarDays />} label="Due this week" value={tasks.filter((task) => task.status !== 'done').length} note="Keep an eye on these" tone="blue" /></div>
            <div className="content-grid"><div className="panel project-panel"><div className="panel-heading"><h2>Active projects</h2><button className="text-button" onClick={() => setView('projects')}>View all <span>→</span></button></div><div className="project-list">{projects.map((project) => <ProjectRow key={project.id} project={project} tasks={tasks.filter((task) => task.projectId === project.id)} onClick={() => { setSelectedId(project.id); setView('projects'); }} />)}</div></div><div className="panel activity-panel"><div className="panel-heading"><h2>Recent activity</h2><Activity size={18} className="muted-icon" /></div><div className="activity-list">{activity.slice(0, 5).map((item) => <div className="activity-item" key={item.id}><span className="activity-dot" style={{ background: item.color }} /><div><p>{item.text}</p><small>{item.time}</small></div></div>)}</div></div></div>
            <div className="quote-card"><div className="quote-mark">"</div><div><p>Small steps, shipped consistently, make remarkable work.</p><span>— The taskflow principle</span></div><div className="quote-art"><span /><span /><span /></div></div>
          </section>
        ) : (
          <section className="page">
            <div className="page-heading project-heading"><div><h1>{selected?.name}</h1><p className="subheading">{selected?.description}</p></div><button className="primary-button" onClick={() => { setEditingTask(null); setShowTaskForm(true); }}><Plus size={17} /> New task</button></div>
            <div className="project-switcher">{projects.map((project) => <button key={project.id} className={project.id === selected?.id ? 'project-tab active' : 'project-tab'} onClick={() => setSelectedId(project.id)}><span style={{ background: project.color }} />{project.name}</button>)}<button className="add-project-tab" onClick={() => setShowProjectForm(true)}><Plus size={15} /> Add project</button></div>
            <div className="detail-stats"><div><span>Progress</span><b>{progress}%</b><div className="progress-track large"><i style={{ width: `${progress}%`, background: selected?.color }} /></div></div><div><span>Open tasks</span><b>{projectTasks.filter((task) => task.status !== 'done').length}</b><small>of {projectTasks.length} total</small></div><div><span>Due date</span><b>{selected ? new Date(selected.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</b><small>Project target</small></div><div><span>People</span><div className="avatar-stack"><span>{initials(user?.name ?? 'You')}</span><span>HM</span><span>+2</span></div><small>4 contributors</small></div></div>
            <div className="task-toolbar"><div className="filter-tabs"><button className={filter === 'all' ? 'selected' : ''} onClick={() => setFilter('all')}>All <b>{projectTasks.length}</b></button><button className={filter === 'todo' ? 'selected' : ''} onClick={() => setFilter('todo')}>To do <b>{projectTasks.filter((task) => task.status === 'todo').length}</b></button><button className={filter === 'in-progress' ? 'selected' : ''} onClick={() => setFilter('in-progress')}>In progress <b>{projectTasks.filter((task) => task.status === 'in-progress').length}</b></button><button className={filter === 'done' ? 'selected' : ''} onClick={() => setFilter('done')}>Done <b>{doneCount}</b></button></div><button className="filter-button"><Filter size={15} /> Filter</button></div>
            <div className="task-board">{(['todo', 'in-progress', 'done'] as Status[]).map((status) => <div className="task-column" key={status}><div className="column-heading"><span className={`status-dot ${status}`} /> <b>{statusLabels[status]}</b><small>{visibleTasks.filter((task) => task.status === status).length}</small></div><div className="task-cards">{visibleTasks.filter((task) => task.status === status).map((task) => <TaskCard key={task.id} task={task} onStatus={updateStatus} onEdit={() => { setEditingTask(task); setShowTaskForm(true); }} />)}{visibleTasks.filter((task) => task.status === status).length === 0 && <div className="empty-column"><Circle size={17} /><span>No tasks here</span></div>}</div></div>)}</div>
          </section>
        )}
      </main>
      {showProjectForm && <ProjectModal onClose={() => setShowProjectForm(false)} onSave={addProject} />}
      {showTaskForm && <TaskModal projectId={selected?.id ?? ''} task={editingTask} onClose={() => { setShowTaskForm(false); setEditingTask(null); }} onSave={saveTask} />}
    </div>
  );
}

function Metric({ icon, label, value, note, tone }: { icon: ReactNode; label: string; value: number; note: string; tone: string }) {
  return <div className="metric-card"><div className={`metric-icon ${tone}`}>{icon}</div><div><span>{label}</span><b>{value}</b><small>{note}</small></div></div>;
}

function ProjectRow({ project, tasks, onClick }: { project: Project; tasks: Task[]; onClick: () => void }) {
  const done = tasks.filter((task) => task.status === 'done').length;
  return <button className="project-row" onClick={onClick}><span className="project-color" style={{ background: project.color }} /><div className="project-row-main"><div><b>{project.name}</b><span>{project.description}</span></div><strong>{tasks.length ? Math.round((done / tasks.length) * 100) : 0}%</strong></div><div className="progress-track"><i style={{ width: `${tasks.length ? (done / tasks.length) * 100 : 0}%`, background: project.color }} /></div></button>;
}

function TaskCard({ task, onStatus, onEdit }: { task: Task; onStatus: (task: Task, status: Status) => void; onEdit: () => void }) {
  const next: Status = task.status === 'todo' ? 'in-progress' : task.status === 'in-progress' ? 'done' : 'todo';
  return <article className="task-card"><div className="task-card-top"><span className={`priority ${task.priority}`}>{priorityLabels[task.priority]}</span><button onClick={onEdit} aria-label="Edit task"><MoreHorizontal size={17} /></button></div><h3>{task.title}</h3><p>{task.description}</p><div className="task-card-bottom"><span className="assignee">{task.assignee.slice(0, 2).toUpperCase()}</span><span className="due"><CalendarDays size={13} />{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span><button className="status-action" onClick={() => onStatus(task, next)} title={`Move to ${statusLabels[next]}`}>{task.status === 'done' ? <Check size={14} /> : <ChevronDown size={14} />}</button>{task.comments.length > 0 && <span className="comment-count"><MessageSquare size={13} /> {task.comments.length}</span>}</div></article>;
}

function Modal({ children, title, onClose }: { children: ReactNode; title: string; onClose: () => void }) {
  return <div className="modal-backdrop"><div className="modal"><div className="modal-heading"><h2>{title}</h2><button onClick={onClose}><X size={18} /></button></div>{children}</div></div>;
}

function ProjectModal({ onClose, onSave }: { onClose: () => void; onSave: (data: Omit<Project, 'id'>) => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('2026-10-15');
  return <Modal title="Create a project" onClose={onClose}><form onSubmit={(event) => { event.preventDefault(); if (name.trim()) onSave({ name: name.trim(), description: description.trim() || 'A new team project.', dueDate, color: '#5B3DF0' }); }}><label>Project name<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Product redesign" /></label><label>Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What are you working towards?" /></label><label>Due date<input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">Create project</button></div></form></Modal>;
}

function TaskModal({ projectId, task, onClose, onSave }: { projectId: string; task: Task | null; onClose: () => void; onSave: (data: Omit<Task, 'id' | 'comments'> & { id?: string; comments?: string[] }) => void }) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [status, setStatus] = useState<Status>(task?.status ?? 'todo');
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'medium');
  const [assignee, setAssignee] = useState(task?.assignee ?? 'Ayesha');
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '2026-09-01');
  return <Modal title={task ? 'Edit task' : 'Create a task'} onClose={onClose}><form onSubmit={(event) => { event.preventDefault(); if (title.trim()) onSave({ id: task?.id, projectId, title: title.trim(), description: description.trim(), status, priority, assignee, dueDate, comments: task?.comments }); }}><label>Task title<input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What needs to be done?" /></label><label>Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Add useful context..." /></label><div className="form-grid"><label>Status<select value={status} onChange={(event) => setStatus(event.target.value as Status)}>{Object.entries(statusLabels).map(([key, label]) => <option value={key} key={key}>{label}</option>)}</select></label><label>Priority<select value={priority} onChange={(event) => setPriority(event.target.value as Priority)}>{Object.entries(priorityLabels).map(([key, label]) => <option value={key} key={key}>{label}</option>)}</select></label></div><div className="form-grid"><label>Assignee<select value={assignee} onChange={(event) => setAssignee(event.target.value)}>{names.map((name) => <option key={name}>{name}</option>)}</select></label><label>Due date<input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></label></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">{task ? 'Save changes' : 'Create task'}</button></div></form></Modal>;
}

export default Dashboard;
