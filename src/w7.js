<script>
function renderWeek7() {
  return chead('week-7') + `<article>

<section>
<h2>1. Where a Database Sits Inside an Application</h2>
<p>Chapters 1 to 6 treated the database as the whole world. It is not. It is <b>one layer</b> of a
larger program, and knowing which layer explains a great deal about how you talk to it.</p>
<p>First, two words that get used loosely.</p>
${teach('Operating system', 'the manager', [
  'The program that manages the hardware and lets every other program use it.',
  'Because a hundred programs want the same disk, memory and network card, and something has to arbitrate.',
  'The building manager. Nobody rewires the building themselves; they ask the manager, who has the keys.',
  'PostgreSQL asks the operating system for disk space and for a network connection. It never touches the disk directly.',
  'Windows, Linux and macOS on computers; Android and iOS on phones.',
  'System software that manages hardware resources and mediates access for application software.',
])}
${teach('Application software', 'everything else', [
  'A program that does a particular job, running <b>on top of</b> the operating system rather than managing it.',
  'Because the useful work (browsing, playing music, storing data) is not the manager&rsquo;s job.',
  'A tenant in the building. They do their own work and ask the manager whenever they need the plumbing.',
  '<b>PostgreSQL is application software.</b> So is your browser, and so is the Python script you are about to write.',
  'It requests services from the operating system: open this file, listen on this port, give me memory.',
  'A program performing a specific user-facing task, distinct from system software.',
])}
<p>Now the useful part. <b>Almost every application program is built in three layers</b>, and the
split is the same idea as Chapter 1&rsquo;s three levels of abstraction: break a large system into
parts so each can be changed without disturbing the others.</p>
<div class="tw"><table class="pt">
<thead><tr><th>Layer</th><th>Also called</th><th>What lives there</th><th>DBMS parallel</th></tr></thead>
<tbody>
<tr><td><b>Presentation</b></td><td>front end, UI</td><td>What the user sees and clicks. <b>HTML and CSS build this layer.</b></td><td>the <b>view</b> level</td></tr>
<tr><td><b>Business logic</b></td><td>application layer</td><td>The actual rules and code. What happens when the button is pressed. Django, Java, PHP, Node.js</td><td>the <b>logical</b> level</td></tr>
<tr><td><b>Data access</b></td><td>back end, data tier</td><td>Where information is stored and retrieved. <b>The DBMS is here.</b></td><td>the <b>physical</b> level</td></tr>
</tbody></table></div>
<p>So a web page never talks to a table. The page collects a click, the business logic decides what
that click means, and only then does something send SQL down to the data layer.</p>
<p>Two placements are asked directly and are worth stating flatly: <b>HTML belongs to the
presentation layer</b>, and <b>the DBMS belongs to the data access layer</b>. Your Python script in
this chapter is the business logic layer, standing in for what a real application would do.</p>
${fig('f-lay',
`<div class="panel">
  <svg class="d" viewBox="0 0 520 176" id="ly-svg"></svg>
  <div class="msg" id="ly-note" style="border-top:1px solid var(--border);margin-top:8px;padding-top:10px"></div>
</div>`,
'Fig 7.1, The three layers of an application, and the DBMS sitting at the bottom of them.',
`<span class="lab">layer:</span>${pills('ly', [['p', 'presentation'], ['b', 'business logic'], ['d', 'data access']], -1)}`,
'the DBMS lives in the bottom layer, and everything above it is somebody else&rsquo;s code')}
<p>One more piece of context. Building an application is usually described in <b>four phases</b>,
and the order is asked as a sequence:</p>
<div class="eq"><span class="v">business modeling</span> <span class="op">&rarr;</span> <span class="v">data modeling</span> <span class="op">&rarr;</span> <span class="v">process modeling</span> <span class="op">&rarr;</span> <span class="v">testing and turnover</span>
<span class="eqn">understand the business first, then the data it needs, then the processes over that data</span></div>
<p>The order is not arbitrary. You cannot decide what data to store until you understand the
business, and you cannot design processes until you know what data exists. <b>Data modeling is
Chapter 4</b>, sitting right where you would expect.</p>
</section>

<section>
<h2>2. Model, View, Controller</h2>
<p>The presentation layer is itself commonly split into three, and the split has a name.</p>
${teach('MVC', 'model, view, controller', [
  'A way of organising the front end into three parts: the data, its display, and the handling of user actions.',
  'Because mixing them means changing how something looks forces you to touch the code that fetches it, and neither change is safe any more.',
  'A restaurant: the kitchen holds the food (model), the plating decides how it looks (view), and the waiter takes your order and brings it back (controller).',
  'A blood-bank site: the available blood groups are the model, the results page is the view, and the code reacting to the search button is the controller.',
  'The controller receives an event, runs the action, and hands back a view. The model never knows how it is displayed.',
  'An architectural pattern separating data representation, presentation, and input handling.',
])}
<dl class="tight">
  <dt>Model</dt>
  <dd>The data itself and the rules about it. Which blood groups are available and where.</dd>
  <dt>View</dt>
  <dd>How that data is presented, which depends on the display device. A search box with a
  magnifying-glass icon beside it is a view decision: <b>without the icon, nobody knows the box is
  for searching</b>, even though the data behind it is identical.</dd>
  <dt>Controller</dt>
  <dd>Receives <b>events</b> (a click, a keystroke), executes the corresponding action, and returns
  a view.</dd>
</dl>
${fig('f-mvc',
`<div class="panel">
  <div class="phead"><span class="m" id="mv-step"></span><span class="m" id="mv-part"></span></div>
  <svg class="d" viewBox="0 0 520 122" id="mv-svg"></svg>
  <div class="msg" id="mv-note" style="border-top:1px solid var(--border);margin-top:8px;padding-top:10px"></div>
</div>`,
'Fig 7.2, One search, traced through model, view and controller in the order they act.',
`<button class="btn" id="mv-next">Next step</button><button class="btn" id="mv-reset">Reset</button>`,
'the controller receives the event; the model holds the data; the view presents it')}
</section>

<section>
<h2>3. One Tier, Two Tiers, Three Tiers</h2>
<p>Those layers describe how the code is <b>organised</b>. Tiers describe how many separate
<b>running processes</b> the work is spread across, and it is a different question, because two
layers can perfectly well live in one process.</p>
${teach('Client-server model', 'two processes, one asking and one answering', [
  'One program (the client) sends a request; another (the server) receives it, does the work, and sends a reply.',
  'Because it lets many clients share one store of data, and lets the store keep running when any client closes.',
  'Ordering at a counter. You ask, they prepare, they hand it back. The counter stays open when you leave.',
  '<b>pgAdmin is a client; the PostgreSQL server is the server.</b> Your Python script is another client of the same server.',
  'They need <b>not</b> be different computers. Two processes on one machine work exactly the same way, and that is the common case while learning.',
  'An architecture in which service requests from client processes are handled by a distinct server process.',
])}
<p>The clearest way to see the difference is a test you can actually run: <b>close pgAdmin, then open
a command prompt and query the database anyway.</b> It works, because the server was never part of
pgAdmin. It was a separate process the whole time, and closing one client does not disturb it or any
other client.</p>
<div class="tw"><table class="pt">
<thead><tr><th>Tiers</th><th>Shape</th><th>Example</th></tr></thead>
<tbody>
<tr><td><b>One</b></td><td>One monolithic process holding data and query interface together. Kill it and everything stops</td><td><b>SQLite.</b> There is no separate server; the database is a file the program opens directly</td></tr>
<tr><td><b>Two</b></td><td>Client and server as separate processes, on one machine or two</td><td><b>pgAdmin and the PostgreSQL server.</b> Also your Python script and that same server</td></tr>
<tr><td><b>Three</b></td><td>Presentation, business logic and data access separated out</td><td>A browser showing a page, application code running the logic, and PostgreSQL storing the data</td></tr>
<tr><td><b>N</b></td><td>Further services split out again</td><td>Add a file transfer server, an authentication service, a cache. This is where port numbers start to matter</td></tr>
</tbody></table></div>
${fig('f-tier',
`<div class="panel">
  <div class="phead"><span class="m" id="ti-hd"></span><span class="m" id="ti-n"></span></div>
  <svg class="d" viewBox="0 0 520 116" id="ti-svg"></svg>
  <div class="msg" id="ti-note" style="border-top:1px solid var(--border);margin-top:8px;padding-top:10px"></div>
</div>`,
'Fig 7.3, The same job spread over one, two, three and many processes. Count the boxes to count the tiers.',
`<span class="lab">architecture:</span>${pills('ti', [['1', 'one tier'], ['2', 'two tier'], ['3', 'three tier'], ['n', 'n tier']], 1)}`,
'a tier is a separate running process, not a layer of code')}
<p>The reason to care: <b>your Python code is a client of a server that is already running.</b>
Everything about connecting follows from that one fact.</p>
</section>

<section>
<h2>4. The Three-Layer Web Architecture</h2>
<p>A web application has its own three-part vocabulary, and it is <b>not</b> the same list as
section 1. Both are called "three-layer" and they are asked about separately, so keep them apart.</p>
<div class="eq"><span class="v">web server</span> <span class="op">&middot;</span> <span class="v">application server</span> <span class="op">&middot;</span> <span class="v">database server</span>
<span class="eqn">these are three <b>servers</b>, not the presentation / logic / data layers of section 1</span></div>
<p><b>The graphical user interface is not one of them.</b> That is the trap the question sets: a GUI
is what the browser provides, and it belongs to the presentation layer, not to the server-side
architecture.</p>
<dl class="tight">
  <dt>Web server</dt>
  <dd>Receives HTTP requests from many clients at once and sends back responses. If the document
  named in the URL is an <b>executable program</b>, the web server runs it and returns the HTML it
  generates. It is <b>not</b> responsible for the graphical interface.</dd>
  <dt>Application server</dt>
  <dd>Runs the business logic. This is where servlets and JSP live.</dd>
  <dt>Database server</dt>
  <dd>Stores and retrieves the data. PostgreSQL.</dd>
</dl>
${teach('HTTP', 'the protocol of the web', [
  'The set of rules a browser and a web server use to talk to each other.',
  'Because both sides must agree on the format of a request and a reply, or neither can understand the other.',
  'The conventions of a formal letter. Both writer and reader know where the address goes and where the signature goes.',
  'It is the <code>https</code> at the front of every URL, and it is how a cookie travels (section 6).',
  'The client sends a request; the server sends a response. HTTP is <b>stateless</b>, which is why section 6 exists.',
  'An application-layer request-response protocol for distributed hypermedia systems.',
])}
${fig('f-web',
`<div class="panel">
  <div class="phead"><span class="m" id="wb-hd"></span><span class="m" id="wb-n"></span></div>
  <svg class="d" viewBox="0 0 520 116" id="wb-svg"></svg>
  <div class="msg" id="wb-note" style="border-top:1px solid var(--border);margin-top:8px;padding-top:10px"></div>
</div>`,
'Fig 7.4, One click, from browser to database and back. Step through to see which server does what.',
`<button class="btn" id="wb-step">Step</button><button class="btn" id="wb-back">Back</button>
 <button class="btn" id="wb-reset">Reset</button>`,
'three servers, and the browser is not one of them')}
</section>

<section>
<h2>5. Web Apps, Native Apps and Hybrid Apps</h2>
<p>Three ways to deliver an application, and the differences come down to <b>where the code runs</b>
and <b>how many platforms it must be written for</b>.</p>
<div class="tw"><table class="pt">
<thead><tr><th></th><th>Web app</th><th>Native app</th><th>Hybrid app</th></tr></thead>
<tbody>
<tr><td><b>What it is</b></td><td>A website opened in a browser</td><td>Built for one specific operating system</td><td>One codebase wrapped to run on several</td></tr>
<tr><td><b>Runs in</b></td><td>a browser, on phone, PC or tablet</td><td>the OS directly</td><td>a wrapper around web technology</td></tr>
<tr><td><b>Depends on the OS?</b></td><td>no</td><td><b>heavily</b>, it is platform specific</td><td>partly</td></tr>
<tr><td><b>On the App Store or Google Play?</b></td><td><b>no</b></td><td>yes</td><td>yes</td></tr>
<tr><td><b>Cost to reach many platforms</b></td><td>lowest</td><td><b>highest</b>, one build per platform</td><td>low, better scalability</td></tr>
</tbody></table></div>
<p>Two statements worth checking against that table, because both are commonly offered and both are
<b>false</b>:</p>
<dl class="tight">
  <dt>"Developing a native app is cheaper than a hybrid app, because it can be built for
  cross-platforms."</dt>
  <dd><b>False</b>, and backwards. It is the <b>hybrid</b> app that is cross-platform: build once,
  launch elsewhere with ease. A native app must be rewritten per platform, so it costs more.</dd>
  <dt>"Native apps are independent of the operating system on which they run."</dt>
  <dd><b>False.</b> Native apps are the <i>most</i> OS-dependent of the three, because being platform
  specific is exactly what "native" means.</dd>
</dl>
<p>And the two true ones: <b>native and hybrid apps are distributed through the app stores</b>, while
a <b>web app is a website you open in a browser</b> and therefore is not.</p>
</section>

<section>
<h2>6. How the Web Remembers You: Cookies and Sessions</h2>
<p>HTTP is <b>stateless</b>: each request arrives with no memory of the last one. So how does a site
know you are still logged in three pages later? Two mechanisms, and they are opposites in one crucial
respect.</p>
${teach('Cookie', 'a small file kept by the browser', [
  'A small piece of data the server sends to the browser, which the browser stores and sends back on later requests.',
  'Because HTTP forgets everything between requests, and something has to carry the thread.',
  'A cloakroom ticket. The cloakroom gives you a numbered stub; you hand it back later and they know which coat is yours.',
  'A site sets a cookie holding a session id, and every later request carries it so the server knows who you are.',
  'Cookies are <b>client-side</b>: the browser holds them. They travel in an <b>HTTP header</b>. Their lifetime may be short or <b>permanent</b>.',
  'A small block of data created by a web server and stored on the client.',
])}
${teach('Session', 'the record kept by the server', [
  'Data the <b>server</b> keeps about one ongoing conversation with one client.',
  'Because the sensitive part of the state should not live on the user&rsquo;s machine where they could edit it.',
  'The cloakroom&rsquo;s own ledger, matching stub numbers to coats. You hold the stub; they hold the ledger.',
  'The cookie carries only the session id; the shopping basket contents sit in the session on the server.',
  'Sessions are <b>server-side</b>. The server also keeps a record of the cookies it issued, so it can use that information when serving a request.',
  'Server-side state associated with a sequence of requests from one client.',
])}
<div class="eq"><span class="v">cookies</span> are client-side files <span class="op">&middot;</span> <span class="v">sessions</span> are server-side files
<span class="eqn">the statement with these swapped is the standard wrong answer</span></div>
<p>So, taking the true statements together: a server <b>does</b> keep information about the cookies
it issued and can use it when serving a request; cookies <b>are</b> created and shared between server
and browser via an HTTP header; and a cookie&rsquo;s duration <b>may</b> be permanent. Only the
"sessions are client-side, cookies are server-side" claim is wrong, and it is wrong because it has
the two exactly the wrong way round.</p>
</section>

<section>
<h2>7. What Runs on the Server: Servlets, JSP and Caching</h2>
<p>The application server has to produce HTML. Two Java technologies for that come up by name.</p>
<dl class="tight">
  <dt>Servlet</dt>
  <dd>A Java program running on the server that generates a response. Producing a page from one means
  a great many print statements, which is tedious and hard to change.</dd>
  <dt>JSP, Java Server Pages</dt>
  <dd>An HTML page with Java embedded in it. <b>A JSP <i>is</i> a servlet</b>, compiled into one
  behind the scenes, but it is far more convenient: you write regular HTML rather than a million
  <code>println</code> statements that generate the HTML.</dd>
</dl>
<p>Three properties of JSP get asked, and one of them is a trap.</p>
<ul>
  <li><b>JSP is platform independent and portable.</b> True, since it is Java.</li>
  <li><b>JSP makes it more convenient to write and modify regular HTML than servlets do.</b> True,
  and it is the main reason JSP exists.</li>
  <li><b>JSP is executed by the web server before the response is sent</b>, so it runs
  <b>server-side</b>. It can therefore reach <b>server</b> resources such as databases and catalogues,
  and it <b>cannot</b> reach client-side resources. Any claim that JSP executes at the client, or
  validates input without a round trip, is <b>false</b>.</li>
</ul>

<h3>Caching</h3>
<p>Caching keeps a copy of something expensive so it need not be produced again, and the question is
always <b>where</b> the copy sits.</p>
<div class="tw"><table class="pt">
<thead><tr><th>Cached thing</th><th>Where</th><th>Why there</th></tr></thead>
<tbody>
<tr><td>JDBC connections between servlet requests</td><td><b>server site</b></td><td>The connection belongs to the application server</td></tr>
<tr><td>Generated HTML</td><td><b>server site</b></td><td>The server generated it, so the server keeps it</td></tr>
<tr><td>Results of database queries</td><td><b>server site</b></td><td>The query ran on the server</td></tr>
<tr><td>Pages cached by a web proxy</td><td><b>client network</b></td><td>A proxy sits near the client, serving many users on that network</td></tr>
</tbody></table></div>
<p>The pattern is simple once seen: <b>everything the application itself produces or holds is cached
at the server; only the web proxy caches at the client network.</b> A proxy is the odd one out
because it is infrastructure near the user rather than part of the application.</p>
</section>

<section>
<h2>8. Addressing a Machine: Host, Loopback and Port</h2>
<p>To send a request you must say <b>which machine</b> and <b>which program on it</b>. Those are two
separate pieces of information, with separate names.</p>
${teach('IP address', 'which machine', [
  'A number identifying one computer on a network, written as four parts such as <code>142.250.183.14</code>.',
  'Because a request has to be delivered somewhere, and names like google.com mean nothing to the network itself.',
  'A postal address. It gets the envelope to the right building and no further.',
  'The <code>host</code> part of a database connection string.',
  'Every machine reachable on a network has one. Private networks reuse the same ranges internally.',
  'A numeric label assigned to a device participating in a network using the Internet Protocol.',
])}
${teach('Loopback address', '127.0.0.1, also written localhost', [
  'A special address meaning <b>this same computer</b>.',
  'Because while learning, the client and the server are usually the same machine, and the request still has to be addressed to something.',
  'Posting a letter to your own house. It goes out and comes straight back.',
  '<code>host=&rsquo;localhost&rsquo;</code> or <code>host=&rsquo;127.0.0.1&rsquo;</code>. They mean the same thing.',
  'The request never leaves the machine. It is handed straight back to a local process.',
  'A reserved address that routes network traffic back to the originating host.',
])}
${teach('Port', 'which program on that machine', [
  'A number identifying one particular service among the many running on one machine.',
  'Because the IP address gets you to the computer, and that computer may run a database, a web server and a mail server at once. Something must say which.',
  'A flat number after the street address. The street gets you to the building; the flat number gets you to the right door.',
  '<b>PostgreSQL uses 5432 by default.</b> Web servers use 80, secure web 443, and Django&rsquo;s development server 8000.',
  'It is an operating-system concept: the OS routes incoming traffic to whichever process claimed that number.',
  'A numeric identifier for a communication endpoint within a host.',
])}
<div class="eq"><span class="v">127.0.0.1</span> <span class="op">:</span> <span class="v">5432</span>
<span class="eqn">which machine &middot; which service on it</span></div>
${fig('f-conn',
`<div class="panel">
  <svg class="d" viewBox="0 0 520 106" id="cn-svg"></svg>
  <div class="msg" id="cn-note" style="border-top:1px solid var(--border);margin-top:8px;padding-top:10px"></div>
</div>`,
'Fig 7.5, A connection string, part by part. Every piece answers one question the server needs answered.',
`<span class="lab">explain:</span>${pills('cn', [['h', 'host'], ['p', 'port'], ['d', 'dbname'], ['u', 'user'], ['w', 'password']], -1)}`,
'the connection string is an address plus a set of credentials')}
</section>

<section>
<h2>9. Reading a URL</h2>
<p>A web address is built on the same idea, so it is worth taking one apart.</p>
<div class="eq"><span class="v">https</span><span class="op">://</span><span class="v">meet.google.com</span><span class="op">/</span><span class="v">abc-defg-hij</span>
<span class="eqn">protocol &middot; domain name &middot; resource</span></div>
<dl class="tight">
  <dt>Protocol</dt>
  <dd><code>https</code>, <code>http</code>, <code>ftp</code>. It says <b>how</b> to talk, not where
  to go.</dd>
  <dt>Domain name</dt>
  <dd>The name of the machine. It is not an address: it is a name that must be
  <b>translated</b> into one.</dd>
  <dt>Resource</dt>
  <dd>Everything after the first slash: which document or service <b>within</b> that machine. It may
  also carry parameters, as in <code>?search=dbms</code>, in which case it is a query rather than a
  file.</dd>
</dl>
${teach('DNS', 'domain name system', [
  'A worldwide directory translating a domain name into the IP address behind it.',
  'Because people remember names and the network only understands numbers.',
  'A phone book. You look up the name; you dial the number.',
  'Typing <code>meet.google.com</code> triggers a DNS lookup that returns the IP address the browser then contacts.',
  'The browser caches answers for sites you visit often, so most lookups never leave your machine. A first visit to an unknown site does go out, to a DNS server such as <code>8.8.8.8</code> or <code>1.1.1.1</code>.',
  'A hierarchical distributed naming system mapping domain names to IP addresses.',
])}
<p>DNS servers are real machines in real places, which is why a regional DNS failure makes new sites
unreachable while sites you visit often keep working: those are answered from your browser&rsquo;s
own cache.</p>
<p>Three related abbreviations, since they are easy to mix up: <b>URI</b> is the general term for an
identifier; a <b>URL</b> identifies something by saying <i>where</i> it is; a <b>URN</b> identifies it
by <i>name</i> alone. Every URL is a URI.</p>
</section>

<section>
<h2>10. There Is a Server Running Already</h2>
<p>Now the practical consequence, and it is the one thing to hold onto before writing any code.</p>
<p>Installing PostgreSQL started a <b>background process</b> that is running right now, whether or
not any tool is open. Open the task manager and you can see it. Everything else, pgAdmin, a command
prompt, your Python script, is a client that connects to it, asks for something, and disconnects.</p>
<p>So a Python script does not open a database <i>file</i>. There is no file to open. It opens a
<b>network connection</b> to a program, and that program does all the reading and writing on its own
behalf.</p>
<p>Three consequences follow immediately, and each explains something that otherwise looks
arbitrary:</p>
<ul>
  <li><b>You must authenticate.</b> The server has no idea who you are, so a username and password
  are part of connecting.</li>
  <li><b>Connections are a limited resource.</b> Each one costs the server memory, which is why
  closing them matters and why leaked connections eventually break an application.</li>
  <li><b>Everything can fail.</b> The server may be down, the password wrong, the network gone. This
  is why the next sections are about error handling rather than about SQL.</li>
</ul>
</section>

<section>
<h2>11. Connecting from Python</h2>
<p>Python does not speak to PostgreSQL directly. A <b>driver</b> library sits in between, translating
Python calls into the protocol the server expects. For PostgreSQL that is
<code>psycopg2</code>.</p>
<pre><code><span class="kw">import</span> psycopg2

conn = psycopg2.connect(
    host     = <span class="st">'127.0.0.1'</span>,   <span class="cm"># which machine: this one</span>
    port     = <span class="st">'5432'</span>,        <span class="cm"># which service on it</span>
    dbname   = <span class="st">'library'</span>,     <span class="cm"># which database inside the server</span>
    user     = <span class="st">'postgres'</span>,
    password = <span class="st">'secret'</span>
)</code></pre>
<p><code>dbname</code> is the piece that is easy to overlook. One PostgreSQL server holds <b>many</b>
databases, so host and port get you to the server and <code>dbname</code> chooses which one inside
it.</p>
<p>All the major drivers follow the same standard, called the <b>DB-API</b>, so the shape of the code
is the same whichever database you use. Swapping PostgreSQL for MySQL changes the import and the
connection arguments, not the structure.</p>
</section>

<section>
<h2>12. The Cursor</h2>
${teach('Cursor', 'the thing that runs queries', [
  'An object created from a connection, used to execute SQL and to walk through the rows that come back.',
  'Because a result may contain millions of rows, and pulling them all into memory at once would be reckless. The cursor lets you take them a few at a time.',
  'A bookmark in a long list. It remembers where you have read up to, so you can carry on rather than starting again.',
  '<code>cur = conn.cursor()</code>, then <code>cur.execute(&hellip;)</code>, then a fetch.',
  '<b>The cursor moves forward only.</b> Once a row has been fetched it is gone: fetching again continues from where you stopped.',
  'A control structure enabling traversal over the records of a result set.',
])}
<dl class="tight">
  <dt><code>cur.fetchone()</code></dt>
  <dd>The next single row, as a tuple. Returns <code>None</code> when there are no more, which is how
  you know to stop.</dd>
  <dt><code>cur.fetchmany(n)</code></dt>
  <dd>The next <i>n</i> rows, as a list. Returns a shorter list, or an empty one, near the end.</dd>
  <dt><code>cur.fetchall()</code></dt>
  <dd>Every remaining row. Convenient, and dangerous on a large table, since it all lands in
  memory.</dd>
</dl>
${fig('f-fetch',
`<div class="panel">
  <div class="phead"><span class="m">SELECT title FROM book</span><span class="m" id="fc-pos"></span></div>
  <div class="cols" style="align-items:flex-start">
    <div><div class="tname">result set on the server</div><table class="dt" id="fc-tbl"></table></div>
    <div style="flex:1;min-width:180px"><div class="tname">what Python received</div>
      <div id="fc-got" style="font-family:var(--mono);font-size:11.5px;line-height:1.9"></div></div>
  </div>
  <div class="msg" id="fc-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 7.6, The cursor moving through a result set. It only ever moves forward.',
`<button class="btn" id="fc-one">fetchone()</button><button class="btn" id="fc-many">fetchmany(2)</button>
 <button class="btn" id="fc-all">fetchall()</button><button class="btn" id="fc-reset">re-execute</button>`,
'a fetched row is gone; the cursor never goes back')}
<p>The forward-only behaviour surprises people. Call <code>fetchall()</code> after
<code>fetchone()</code> and you get everything <b>except</b> the first row: it was already consumed.
To read the result again you must run the query again.</p>
</section>

<section>
<h2>13. Failing Safely</h2>
<p>Every step so far can fail, and for different reasons. A password may be wrong, a table may not
exist, the server may be down. Handling all of those identically means you can never tell which
happened.</p>
<p>Python&rsquo;s <b><code>try</code> and <code>except</code></b> blocks exist for exactly this:
<b>handling runtime exceptions</b>. Not for writing to files, not for committing data.</p>
<p>The DB-API defines a <b>hierarchy</b> of exception classes, and the hierarchy is the point:
catching a parent catches all its children.</p>
${fig('f-try',
`<div class="panel">
  <div class="phead"><span class="m" id="tr-hd"></span><span class="m" id="tr-cls"></span></div>
  <svg class="d" viewBox="0 0 520 128" id="tr-svg"></svg>
  <div class="msg" id="tr-note" style="border-top:1px solid var(--border);margin-top:8px;padding-top:10px"></div>
</div>`,
'Fig 7.7, The exception hierarchy, and which handler catches which failure.',
`<span class="lab">what went wrong:</span>${pills('tr', [['op', 'server unreachable'], ['pg', 'table does not exist'], ['ie', 'duplicate primary key'], ['ok', 'nothing'], ['py', 'a bug in your code']], 0)}`,
'catching a parent class catches every failure beneath it')}
<pre><code><span class="kw">import</span> psycopg2

conn = <span class="kw">None</span>
<span class="kw">try</span>:
    conn = psycopg2.connect(host=<span class="st">'127.0.0.1'</span>, port=<span class="st">'5432'</span>,
                            dbname=<span class="st">'library'</span>, user=<span class="st">'postgres'</span>,
                            password=<span class="st">'secret'</span>)
    cur = conn.cursor()
    cur.execute(<span class="st">'SELECT title FROM book'</span>)
    <span class="kw">for</span> row <span class="kw">in</span> cur.fetchall():
        print(row[0])

<span class="kw">except</span> psycopg2.OperationalError <span class="kw">as</span> e:
    print(<span class="st">'could not reach the server:'</span>, e)
<span class="kw">except</span> psycopg2.DatabaseError <span class="kw">as</span> e:
    print(<span class="st">'the database refused the request:'</span>, e)
<span class="kw">except</span> Exception <span class="kw">as</span> e:
    print(<span class="st">'something else went wrong:'</span>, e)
<span class="kw">finally</span>:
    <span class="kw">if</span> conn <span class="kw">is not</span> <span class="kw">None</span>:
        conn.close()</code></pre>
<p>Four things in that code are doing real work, and none is decoration.</p>
<dl class="tight">
  <dt>The order of the <code>except</code> clauses</dt>
  <dd>Python takes the <b>first</b> matching handler. Specific classes must come before general ones,
  or the general one swallows everything and the specific handlers become unreachable.</dd>
  <dt><code>conn = None</code> before the <code>try</code></dt>
  <dd>If <code>connect()</code> itself fails, the name <code>conn</code> would otherwise never be
  bound, and the <code>finally</code> block would crash with <code>NameError</code> while trying to
  clean up.</dd>
  <dt><code>finally</code></dt>
  <dd>Runs whether or not an exception occurred. This is where closing belongs, because a connection
  left open on the error path is exactly the one that leaks.</dd>
  <dt>The <code>if conn is not None</code> guard</dt>
  <dd>For the same reason: on a failed connect there is nothing to close.</dd>
</dl>
</section>

<section>
<h2>14. Changing Data, and COMMIT</h2>
<p>Reading needs nothing extra. <b>Writing does</b>, and the reason goes straight back to
Chapter 1.</p>
<p>By default psycopg2 opens a <b>transaction</b> for you. Your <code>INSERT</code> happens inside
it, and stays invisible to everyone else until you say the transaction is finished. That is atomicity
being enforced: the guarantee that a group of changes lands all together or not at all.</p>
<pre><code>cur.execute(<span class="st">"INSERT INTO book (isbn, title) VALUES (%s, %s)"</span>,
            (<span class="st">'978-0132'</span>, <span class="st">'Database System Concepts'</span>))
conn.commit()   <span class="cm"># without this, the row is discarded</span></code></pre>
<p><b>Forget <code>commit()</code> and the row is silently lost</b> when the connection closes. No
error is raised. The script appears to work, and the table is empty afterwards, which is why this is
the single most common beginner bug in this chapter.</p>
<p>Its counterpart is <code>conn.rollback()</code>, which abandons everything since the last commit.
That belongs in an error handler: if the third of four inserts fails, rolling back undoes the first
two rather than leaving the database half-updated.</p>
<div class="eq"><span class="v">commit()</span> makes it permanent <span class="op">&middot;</span> <span class="v">rollback()</span> undoes it entirely
<span class="eqn">atomicity, from Chapter 1, as two method calls</span></div>
</section>

<section>
<h2>15. Embedded SQL, and Never Building SQL by Joining Strings</h2>

<h3>Embedded SQL</h3>
${teach('Embedded SQL', 'SQL written inside another language', [
  'SQL statements written directly inside the source code of a general-purpose language such as C or Java.',
  'Because an application needs both: the host language for logic and control flow, and SQL for the data.',
  'Quoting a foreign phrase inside an English sentence, with quotation marks so the reader knows where it starts.',
  'A Java program containing <code>EXEC SQL SELECT ...</code>, compiled and run as one program.',
  'The marker <b><code>EXEC SQL</code></b> identifies the request to the <b>preprocessor</b>, which converts it into calls the compiler understands before compilation.',
  'SQL statements embedded in a host language, processed by a precompiler.',
])}
<p>Two clarifications, since both appear as options. Embedded SQL <b>combines high-level language
statements with SQL</b>, which is the whole idea. And it is <b>not</b> restricted to procedures,
functions or triggers: those are stored inside the database, whereas embedded SQL lives in your
application program.</p>
<p>The psycopg2 code in this chapter is a close relative: SQL travelling as a string inside a Python
program. The difference is that psycopg2 sends the string at runtime, whereas true embedded SQL is
translated before compilation.</p>

<h3>SQL injection</h3>
<p>A query usually needs a value that came from a user. There are two ways to get it in, they look
almost identical, and one of them hands your database to a stranger.</p>
<pre><code><span class="cm"># WRONG - the value is glued into the SQL text</span>
cur.execute(<span class="st">"SELECT * FROM users WHERE name = '"</span> + name + <span class="st">"'"</span>)

<span class="cm"># RIGHT - the value is passed separately, as data</span>
cur.execute(<span class="st">"SELECT * FROM users WHERE name = %s"</span>, (name,))</code></pre>
${teach('SQL injection', 'when data becomes code', [
  'An attack where text typed into an input field is treated as part of the SQL command instead of as a value.',
  'Because gluing strings together destroys the boundary between the query and the data, and the database cannot tell which is which afterwards.',
  'Telling a messenger "say hello to Ravi". If someone is named <i>Ravi, and then burn the building</i>, the messenger cannot tell the name from the instruction.',
  'Entering <code>&rsquo; OR &rsquo;1&rsquo;=&rsquo;1</code> as a name makes the WHERE clause true for every row, returning the whole table.',
  'The fix is <b>parameterised queries</b>: pass values as a separate argument and let the driver handle them. It never inserts them into the SQL text at all.',
  'Injection of SQL syntax through unsanitised input, altering the structure of the intended statement.',
])}
<p>The classic form appears as a multiple-choice question, and the test is mechanical: <b>does the
appended condition make the WHERE clause always true?</b></p>
<div class="tw"><table class="pt">
<thead><tr><th>Appended condition</th><th>Works?</th><th>Why</th></tr></thead>
<tbody>
<tr><td><code>WHERE userid = 160 or 1=1</code></td><td><b>yes</b></td><td>1=1 is always true, and OR makes the whole condition true for every row</td></tr>
<tr><td><code>WHERE userid = 160 or 99=99</code></td><td><b>yes</b></td><td>Same trick with different numbers. Any always-true comparison works</td></tr>
<tr><td><code>WHERE userid = 160 or 1&lt;&gt;1</code></td><td>no</td><td>1&lt;&gt;1 is always <b>false</b>, so OR adds nothing and only user 160 is returned</td></tr>
<tr><td><code>WHERE userid IS 160 or 1=1</code></td><td>no</td><td><code>IS</code> is not valid here. The statement is a syntax error and never runs</td></tr>
</tbody></table></div>
${fig('f-inj',
`<div class="panel">
  <div class="phead"><span class="m" id="ij-mode"></span><span class="m" id="ij-verd"></span></div>
  <div style="font-family:var(--mono);font-size:11.5px;line-height:1.9;margin-bottom:10px" id="ij-sql"></div>
  <table class="dt" id="ij-tbl"></table>
  <div class="msg" id="ij-note" style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px"></div>
</div>`,
'Fig 7.8, The same malicious input against both styles of query. Only one of them stays a query about a name.',
`<span class="lab">input:</span>${pills('ij', [['ok', 'Asha'], ['at', "' OR '1'='1"], ['dr', "'; DROP TABLE users; --"]], 0)}
 <span class="lab">code:</span>${pills('im', [['bad', 'string concatenation'], ['good', 'parameterised']], 0)}`,
'a parameterised value can never become part of the command')}
<p>Two details that are easy to get wrong even once you know the rule.</p>
<ul>
  <li><b>The placeholder is not quoted.</b> Write <code>name = %s</code>, never
  <code>name = '%s'</code>. The driver adds whatever quoting is needed; adding your own reopens the
  hole.</li>
  <li><b>The second argument must be a sequence.</b> A single value needs a trailing comma:
  <code>(name,)</code> is a one-element tuple, while <code>(name)</code> is just <code>name</code> in
  brackets and will raise an error.</li>
</ul>
<p>And note that <code>%s</code> here is <b>not</b> Python string formatting. It is the
driver&rsquo;s own placeholder, which is precisely why it is safe. Using an f-string or
<code>%</code> formatting to build the query puts you straight back in the first case.</p>
</section>

<section>
<h2>16. The Whole Shape</h2>
<p>Every database program in this chapter has the same skeleton. Learn the shape and the details
follow.</p>
<pre><code><span class="kw">import</span> psycopg2

conn = <span class="kw">None</span>
<span class="kw">try</span>:
    <span class="cm"># 1. connect - address, then credentials</span>
    conn = psycopg2.connect(host=<span class="st">'127.0.0.1'</span>, port=<span class="st">'5432'</span>,
                            dbname=<span class="st">'library'</span>, user=<span class="st">'postgres'</span>,
                            password=<span class="st">'secret'</span>)

    <span class="cm"># 2. get a cursor</span>
    cur = conn.cursor()

    <span class="cm"># 3. execute, always with parameters</span>
    cur.execute(<span class="st">"SELECT title FROM book WHERE author = %s"</span>, (author,))

    <span class="cm"># 4. fetch</span>
    <span class="kw">for</span> (title,) <span class="kw">in</span> cur.fetchall():
        print(title)

    <span class="cm"># 5. commit, if anything was written</span>
    conn.commit()

<span class="kw">except</span> psycopg2.OperationalError <span class="kw">as</span> e:
    print(<span class="st">'could not reach the server:'</span>, e)
<span class="kw">except</span> psycopg2.DatabaseError <span class="kw">as</span> e:
    <span class="kw">if</span> conn: conn.rollback()
    print(<span class="st">'the database refused the request:'</span>, e)
<span class="kw">finally</span>:
    <span class="cm"># 6. always close</span>
    <span class="kw">if</span> conn <span class="kw">is not</span> <span class="kw">None</span>:
        conn.close()</code></pre>
${cyu('A script inserts three rows and prints no errors, but the table is empty afterwards. What is missing?',
'<b><code>conn.commit()</code>.</b> psycopg2 opens a transaction automatically, so the three inserts lived inside an uncommitted transaction and were discarded when the connection closed. Nothing raises an error, because from the database&rsquo;s point of view nothing went wrong: a transaction that is never committed is simply abandoned, which is exactly what atomicity requires.')}
</section>

</article>` + cfoot('week-7');
}

function initWeek7() {
  /* ---- Fig 7.1 three layers ---- */
  (function () {
    const L = [['p', 'presentation layer', 'what the user sees and clicks', 22, 'view level'],
      ['b', 'business logic layer', 'the rules, the code, the decisions', 68, 'logical level'],
      ['d', 'data access layer', 'where data is stored and retrieved', 114, 'physical level']];
    const N = {
      p: 'The <b>presentation layer</b>: HTML, CSS, layout. <b>HTML is used to build this layer</b>, which is a question in its own right. Chapter 1 called the same idea the <b>view level</b>.',
      b: 'The <b>business logic layer</b>: the actual code, most often Django, Java, PHP or Node.js. It decides what a click means and what to ask for. <b>Your Python script in this chapter lives here.</b>',
      d: 'The <b>data access layer</b>: where information is stored and retrieved. <b>The DBMS is here</b>, and nothing above this layer ever touches a table directly.',
    };
    function draw(k) {
      let s = '';
      L.forEach(([id, name, sub, y, par]) => {
        const on = id === k;
        s += DG.box(DG.PAD, y, 340, 36, name, sub, {
          fill: on ? 'var(--indigo-tint)' : '#fff',
          stroke: on ? 'var(--indigo)' : '#e5e5e3', r: 4,
        });
        s += DG.txt(374, y + 22, par, { cls: 'm mu' });
      });
      s += DG.txt(DG.PAD, 14, 'an application program', { cls: 'm mu' });
      s += DG.txt(374, 14, 'DBMS parallel', { cls: 'm mu' });
      s += DG.line(360, 40, 360, 150, { stroke: '#eeeeec' });
      s += DG.txt(DG.PAD, 168, 'requests travel down; data travels back up', { cls: 'm mu' });
      $('#ly-svg').innerHTML = s;
      $('#ly-note').innerHTML = k ? N[k]
        : 'Pick a layer. The right-hand column shows the level of Chapter 1 that plays the same role inside the DBMS itself.';
    }
    setPills($('#f-lay'), 'ly', draw);
    draw(null);
  })();

  /* ---- Fig 7.2 MVC ---- */
  (function () {
    const ST = [
      ['view', 'The page is drawn', 'The <b>view</b> presents a search box with a magnifying-glass icon. The icon is a view decision: without it, nobody knows the box is for searching, even though the data behind it is identical.'],
      ['ctrl', 'The user clicks search', 'The click is an <b>event</b>. The <b>controller</b> registers it, reads what was typed, and decides what action to run.'],
      ['model', 'The controller asks the model', 'The <b>model</b> holds the data and its rules, which blood groups are available where. It knows nothing about search boxes or icons.'],
      ['view', 'The result is presented', 'The controller hands the answer back to the <b>view</b>, which decides how to display it. Change the styling here and neither the controller nor the model is touched.'],
    ];
    let k = 0;
    function draw() {
      const cur = ST[k][0];
      const B = [['view', 'View', 14, 'presents'], ['ctrl', 'Controller', 190, 'handles events'],
        ['model', 'Model', 366, 'holds the data']];
      let s = '';
      B.forEach(([id, name, x, sub]) => {
        const on = id === cur;
        s += DG.box(x, 30, 140, 42, name, sub, {
          fill: on ? 'var(--indigo-tint)' : '#fff',
          stroke: on ? 'var(--indigo)' : '#e5e5e3', r: 4,
        });
      });
      [[154, 190, 'event'], [330, 366, 'query']].forEach(([x1, x2, lab]) => {
        s += DG.arrow(x1, 44, x2, 44, { stroke: '#c9c9c4' });
        s += DG.txt((x1 + x2) / 2, 32, lab, { anchor: 'middle', cls: 'm mu' });
      });
      s += `<path d="M436 72 C 436 100, 84 100, 84 72" fill="none" stroke="#c9c9c4"/>`;
      s += `<path d="M90 80 L84 70 L78 80" fill="none" stroke="#c9c9c4" stroke-linecap="round"/>`;
      s += DG.txt(260, 104, 'data returned for display', { anchor: 'middle', cls: 'm mu' });
      s += DG.txt(DG.PAD, 18, 'a search on a blood-bank site', { cls: 'm mu' });
      $('#mv-svg').innerHTML = s;
      $('#mv-step').textContent = 'step ' + (k + 1) + ' of 4 - ' + ST[k][1];
      $('#mv-part').textContent = { view: 'View', ctrl: 'Controller', model: 'Model' }[cur];
      $('#mv-note').innerHTML = ST[k][2];
      $('#mv-next').disabled = k >= ST.length - 1;
      $('#f-mvc-msg').textContent = k >= ST.length - 1
        ? 'Each part changed independently: the model never learned how it is displayed, and the view never learned where the data came from.'
        : 'the controller receives the event; the model holds the data; the view presents it';
    }
    $('#mv-next').onclick = () => { if (k < ST.length - 1) k++; draw(); };
    $('#mv-reset').onclick = () => { k = 0; draw(); };
    draw();
  })();

  /* ---- Fig 7.3 tiers ---- */
  (function () {
    const T = {
      '1': [[['one process', 220]], 'one tier', 'SQLite',
        'A single <b>monolithic</b> process holds the data and the query interface together. There is no server to connect to: the program opens the file itself. Kill the process and everything stops at once.'],
      '2': [[['client', 130], ['server', 130]], 'two tier', 'pgAdmin + PostgreSQL',
        'Two separate processes. The client asks, the server answers. They may be on one machine or two: <b>pgAdmin and PostgreSQL on your own computer is still two tier</b>. Close pgAdmin and the server keeps running, which is why a command prompt can still query it.'],
      '3': [[['browser', 96], ['app code', 96], ['database', 96]], 'three tier', 'browser + app + PostgreSQL',
        'Presentation, business logic and data access as three processes. <b>Your Python script plus PostgreSQL is the bottom two thirds of this.</b>'],
      n: [[['browser', 72], ['app', 72], ['auth', 72], ['files', 72], ['database', 72]], 'n tier',
        'many cooperating services',
        'Services split out further: authentication, file transfer, caching, each its own process. This is where <b>port numbers</b> start doing serious work, since one machine may host several at once.'],
    };
    function draw(k) {
      const [boxes, name, ex, note] = T[k];
      const gap = 18;
      const total = boxes.reduce((a, b) => a + b[1], 0) + gap * (boxes.length - 1);
      let x = (DG.W - total) / 2, s = '';
      boxes.forEach((b, i) => {
        s += DG.box(x, 34, b[1], 40, b[0], null, { fill: '#fff', stroke: 'var(--indigo)', r: 4 });
        if (i < boxes.length - 1) s += DG.arrow(x + b[1] + 2, 54, x + b[1] + gap - 2, 54, { stroke: '#c9c9c4' });
        x += b[1] + gap;
      });
      s += DG.txt(DG.W / 2, 22, boxes.length + (boxes.length === 1 ? ' process' : ' separate processes'),
        { anchor: 'middle', cls: 'm mu' });
      s += DG.txt(DG.W / 2, 98, ex, { anchor: 'middle', cls: 'm mu' });
      $('#ti-svg').innerHTML = s;
      $('#ti-hd').textContent = name;
      $('#ti-n').textContent = boxes.length + (boxes.length === 1 ? ' tier' : ' tiers');
      $('#ti-note').innerHTML = note;
      $('#f-tier-msg').textContent = 'a tier is a separate running process, not a layer of code';
    }
    setPills($('#f-tier'), 'ti', draw);
    draw('2');
  })();

  /* ---- Fig 7.4 web architecture ---- */
  (function () {
    const P = [
      ['browser', 'the click happens', 'not a component',
        'You press a button. The <b>browser</b> provides the graphical interface, which is why the GUI is <b>not</b> one of the three components of the web architecture: it belongs to the presentation layer.'],
      ['web server', 'receives the HTTP request', 'component 1',
        'The <b>web server</b> accepts requests from many clients at once. If the document named in the URL is an <b>executable program</b>, it runs the program and returns the HTML that program generates. It does <b>not</b> build the GUI.'],
      ['application server', 'runs the business logic', 'component 2',
        'The <b>application server</b> runs the logic: servlets, JSP, Django, whatever the application is written in. It decides what data is needed and issues the SQL.'],
      ['database server', 'runs the query', 'component 3',
        'The <b>database server</b> stores and retrieves the data. PostgreSQL. It knows nothing about HTTP or HTML.'],
      ['back up the chain', 'the response is assembled', 'and returned',
        'Rows go back to the application server, which turns them into HTML, which the web server sends back over HTTP, which the browser renders. <b>Server-side caching</b> can short-circuit this: cached query results, cached generated HTML and pooled connections all live at the server.'],
    ];
    const B = [['browser', 8, 92], ['web server', 116, 100], ['application server', 232, 126],
      ['database server', 374, 132]];
    const L = B[0][1] + 6, R = B[3][1] + B[3][2] - 6;
    let k = 0;
    /* Three requests in flight at once, at different phases. The point being
       made in the text is that one web server serves many clients
       simultaneously, which a single travelling dot would contradict. */
    const REQ = [{ p: 0.05 }, { p: 0.42 }, { p: 0.78 }];

    function draw() {
      let s = '';
      B.forEach(([name, x, w], i) => {
        const isBrowser = i === 0;
        s += DG.box(x, 40, w, 36, name, null, {
          fill: i === k ? 'var(--indigo-tint)' : '#fff',
          stroke: i === k ? 'var(--indigo)' : isBrowser ? '#c9c9c4' : '#e5e5e3',
          r: 4, cls: 'm',
        });
        if (i < B.length - 1) s += DG.arrow(x + w + 1, 58, B[i + 1][1] - 1, 58, { stroke: '#c9c9c4' });
      });
      s += DG.txt(DG.PAD, 24, P[k][1], { cls: 'm', fill: 'var(--indigo)' });
      s += DG.txt(8, 96, 'client', { cls: 'm mu' });
      s += DG.txt(116, 96, 'the three components of the web architecture', { cls: 'm mu' });
      /* the lane the requests travel along, above the boxes */
      s += DG.line(L, 32, R, 32, { stroke: '#eeeeec' });
      s += REQ.map((r, i) =>
        `<circle class="wbq" data-i="${i}" cx="${L}" cy="32" r="3.6" fill="var(--indigo)"/>`).join('');
      $('#wb-svg').innerHTML = s;
      place();
      $('#wb-hd').textContent = 'step ' + (k + 1) + ' of 5';
      $('#wb-n').textContent = P[k][2];
      $('#wb-note').innerHTML = P[k][3];
      $('#wb-step').disabled = k >= P.length - 1;
      $('#wb-back').disabled = k <= 0;
      $('#f-web-msg').textContent = k === 0
        ? 'The browser is the client. It is not one of the three components, and neither is the GUI it provides.'
        : 'Several requests are in flight at once, which is the whole point of one server accepting many clients.';
    }

    /* p in [0,1): first half travels right as a request, second half travels
       back left as a response, so each dot makes a round trip. */
    function place() {
      $$('#wb-svg .wbq').forEach(c => {
        const r = REQ[+c.dataset.i];
        const out = r.p < 0.5;
        const t = out ? r.p * 2 : (1 - r.p) * 2;
        c.setAttribute('cx', lerp(L, R, t).toFixed(1));
        c.setAttribute('fill', out ? 'var(--indigo)' : 'var(--green)');
      });
    }

    raf($('#f-web'), dt => {
      REQ.forEach((r, i) => { r.p = (r.p + dt * (0.16 + i * 0.02)) % 1; });
      place();
    });

    $('#wb-step').onclick = () => { if (k < P.length - 1) k++; draw(); };
    $('#wb-back').onclick = () => { if (k > 0) k--; draw(); };
    $('#wb-reset').onclick = () => { k = 0; draw(); };
    draw();
  })();

  /* ---- Fig 7.5 connection string ---- */
  (function () {
    const P = [
      ['h', 16, 132, "host='127.0.0.1'", 'Which <b>machine</b>. <code>127.0.0.1</code> is the loopback address, meaning this same computer: the request goes out and comes straight back. <code>localhost</code> means exactly the same thing.'],
      ['p', 160, 84, "port='5432'", 'Which <b>service</b> on that machine. One computer may run a database, a web server and a mail server at once, and the port number is what tells them apart. <b>5432 is PostgreSQL&rsquo;s default.</b>'],
      ['d', 256, 116, "dbname='library'", 'Which <b>database inside the server</b>. One PostgreSQL server holds many, so host and port get you to the server and this chooses among them. Easy to overlook and a common source of "table does not exist".'],
      ['u', 384, 96, "user='postgres'", 'Who is asking. The server has no idea who you are, so identity is part of connecting: a direct consequence of it being a separate process.'],
      ['w', 16, 168, "password='secret'", 'Proof of identity. In real code this comes from an environment variable or a config file, never from the source itself.'],
    ];
    function draw(k) {
      let s = DG.txt(DG.PAD, 20, 'psycopg2.connect(', { cls: 'm mu' });
      P.forEach(p => {
        const on = p[0] === k;
        const y = p[0] === 'w' ? 72 : 44;
        const x = p[0] === 'w' ? 16 : p[1];
        if (on) s += `<rect x="${x - 6}" y="${y - 16}" width="${p[2]}" height="26" rx="4" ` +
          `fill="var(--indigo-tint)" stroke="var(--indigo)"/>`;
        s += DG.txt(x, y, p[3], { cls: 'm', size: 11.5 });
      });
      s += DG.txt(DG.PAD, 96, ')', { cls: 'm mu' });
      $('#cn-svg').innerHTML = s;
      const hit = P.find(p => p[0] === k);
      $('#cn-note').innerHTML = hit ? hit[4]
        : 'Pick a part of the connection string. The first two say <b>where</b>; the last three say <b>who you are and what you want</b>.';
    }
    setPills($('#f-conn'), 'cn', draw);
    draw(null);
  })();

  /* ---- Fig 7.6 cursor ---- */
  (function () {
    const ROWS = ['Ulysses', 'Dune', 'Emma', 'Hamlet', 'Beloved'];
    let pos = 0, got = [];
    function draw(last) {
      $('#fc-tbl').innerHTML = '<thead><tr><th>title</th></tr></thead><tbody>' +
        ROWS.map((t, i) => `<tr class="${i < pos ? 'out' : i === pos ? 'cu' : ''}">` +
          `<td>${t}</td></tr>`).join('') + '</tbody>';
      $('#fc-got').innerHTML = got.length
        ? got.map(g => `<div>${g}</div>`).join('')
        : '<span style="color:var(--muted)">nothing fetched yet</span>';
      $('#fc-pos').textContent = pos >= ROWS.length ? 'cursor at end, ' + pos + ' of ' + ROWS.length
        : 'cursor at row ' + (pos + 1) + ' of ' + ROWS.length;
      $('#fc-note').innerHTML = last || 'The cursor sits before the first row. Rows shown faded have already been consumed and cannot be fetched again.';
      $('#f-fetch-msg').textContent = pos >= ROWS.length && got.length
        ? 'The result set is exhausted. Any further fetch returns None or an empty list: to read it again you must re-execute the query.'
        : 'a fetched row is gone; the cursor never goes back';
    }
    $('#fc-one').onclick = () => {
      if (pos >= ROWS.length) { got.push('fetchone() -> None'); draw('The cursor is past the last row, so <code>fetchone()</code> returns <b>None</b>. That is how a loop knows to stop.'); return; }
      got.push("fetchone() -> ('" + ROWS[pos] + "',)");
      pos++;
      draw('One row, as a <b>tuple</b>. Note the trailing comma: a single-column row is still a tuple, so it is <code>row[0]</code> that holds the title.');
    };
    $('#fc-many').onclick = () => {
      const take = ROWS.slice(pos, pos + 2);
      got.push('fetchmany(2) -> [' + take.map(t => "('" + t + "',)").join(', ') + ']');
      pos = Math.min(pos + 2, ROWS.length);
      draw(take.length < 2
        ? 'Fewer than 2 rows were left, so the list comes back <b>short</b>. It is never padded.'
        : 'Two rows, as a <b>list of tuples</b>. The cursor advanced by two, so those rows are now consumed.');
    };
    $('#fc-all').onclick = () => {
      const take = ROWS.slice(pos);
      got.push('fetchall() -> [' + take.map(t => "('" + t + "',)").join(', ') + ']');
      const was = pos;
      pos = ROWS.length;
      draw(was > 0
        ? 'Everything <b>remaining</b>. Note that the ' + was + ' already-fetched row' + (was > 1 ? 's are' : ' is') +
          ' missing: <code>fetchall()</code> starts from where the cursor is, not from the top.'
        : 'All five rows at once. Convenient, and dangerous on a large table: every row lands in memory.');
    };
    $('#fc-reset').onclick = () => { pos = 0; got = []; draw('The query has been re-executed, so the cursor is back at the start. This is the <b>only</b> way to read a result set twice.'); };
    draw();
  })();

  /* ---- Fig 7.7 exception hierarchy ---- */
  (function () {
    const E = {
      op: ['OperationalError', 'psycopg2.OperationalError',
        'The server could not be reached at all: wrong host, wrong port, server not running, or bad password. It is a subclass of <code>DatabaseError</code>, so the <b>first</b> handler catches it and the second never runs.'],
      pg: ['ProgrammingError', 'psycopg2.DatabaseError',
        'The server was reached and <b>refused the request</b>: a table that does not exist, or a syntax error in the SQL. <code>ProgrammingError</code> is a <code>DatabaseError</code>, so the second handler catches it.'],
      ie: ['IntegrityError', 'psycopg2.DatabaseError',
        'A constraint was violated: a duplicate primary key, or a foreign key pointing at nothing. Also a <code>DatabaseError</code>, so the second handler catches this one too. This is the database defending its own rules.'],
      ok: [null, null, 'No exception was raised. The <code>except</code> blocks are skipped entirely, but <code>finally</code> still runs, which is precisely why the connection is closed there rather than at the end of the <code>try</code>.'],
      py: ['TypeError', 'Exception',
        'Not a database problem at all: an ordinary Python bug, such as indexing a row that has no such column. Only the broad <code>except Exception</code> catches it, which is why that handler is worth keeping and why it must come <b>last</b>.'],
    };
    const NODES = [
      ['Exception', 150, 20, 108], ['DatabaseError', 150, 58, 116],
      ['OperationalError', 34, 96, 122], ['ProgrammingError', 176, 96, 126],
      ['IntegrityError', 326, 96, 110],
    ];
    function draw(k) {
      const [cls, caught, note] = E[k];
      const path = { op: ['Exception', 'DatabaseError', 'OperationalError'],
        pg: ['Exception', 'DatabaseError', 'ProgrammingError'],
        ie: ['Exception', 'DatabaseError', 'IntegrityError'],
        py: ['Exception'], ok: [] }[k];
      let s = DG.line(204, 40, 204, 58, { stroke: '#c9c9c4' });
      s += DG.line(204, 78, 204, 88, { stroke: '#c9c9c4' });
      s += DG.line(95, 88, 381, 88, { stroke: '#c9c9c4' });
      [95, 239, 381].forEach(x => { s += DG.line(x, 88, x, 96, { stroke: '#c9c9c4' }); });
      NODES.forEach(([name, x, y, w]) => {
        const on = path.includes(name);
        s += DG.box(x, y, w, 20, name, null, {
          fill: on ? 'var(--indigo-tint)' : '#fff',
          stroke: on ? 'var(--indigo)' : '#e5e5e3', r: 3, cls: 'm',
        });
      });
      s += DG.txt(DG.PAD, 126, k === 'ok' ? 'no exception raised'
        : 'raised: ' + cls + '  ->  caught by: except ' + caught, { cls: 'm mu' });
      $('#tr-svg').innerHTML = s;
      $('#tr-hd').textContent = k === 'ok' ? 'the happy path' : 'raised: ' + cls;
      $('#tr-cls').textContent = k === 'ok' ? 'finally still runs' : 'caught by except ' + caught;
      $('#tr-note').innerHTML = note;
      const m = $('#f-try-msg');
      m.className = 'msg ' + (k === 'ok' ? 'good' : '');
      m.textContent = k === 'ok'
        ? 'Nothing failed, and the connection is still closed, because finally runs either way.'
        : 'Handlers are tried in order and the first match wins, so specific classes must be listed before general ones.';
    }
    setPills($('#f-try'), 'tr', draw);
    draw('op');
  })();

  /* ---- Fig 7.8 SQL injection ---- */
  (function () {
    const U = [['1', 'Asha', 'user'], ['2', 'Ravi', 'user'], ['3', 'Meera', 'admin']];
    let inp = 'ok', mode = 'bad';
    const IN = { ok: 'Asha', at: "' OR '1'='1", dr: "'; DROP TABLE users; --" };
    function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
    function draw() {
      const v = IN[inp];
      let sql, rows, verd, note, cls;
      if (mode === 'bad') {
        sql = "SELECT * FROM users WHERE name = '" + v + "'";
        if (inp === 'ok') {
          rows = U.filter(r => r[1] === 'Asha'); verd = '1 row'; cls = '';
          note = 'With harmless input it works, which is exactly why this bug survives so long. The query is correct <b>by luck</b>, not by construction.';
        } else if (inp === 'at') {
          rows = U; verd = 'all ' + U.length + ' rows'; cls = 'bad';
          note = 'The quote in the input <b>closed the string early</b>. What followed was read as SQL, so the condition became <code>name = &rsquo;&rsquo; OR &rsquo;1&rsquo;=&rsquo;1&rsquo;</code>, true for every row. The whole table leaks, including the admin.';
        } else {
          rows = null; verd = 'table dropped'; cls = 'bad';
          note = 'The quote closed the string, the semicolon <b>ended the statement</b>, and a second statement followed. The trailing <code>--</code> comments out the leftover quote so nothing complains. The table is gone.';
        }
      } else {
        sql = 'SELECT * FROM users WHERE name = %s   -- value passed separately: ' + JSON.stringify(v);
        rows = U.filter(r => r[1] === v);
        verd = rows.length + ' row' + (rows.length === 1 ? '' : 's');
        cls = 'good';
        note = inp === 'ok'
          ? 'The value travels as <b>data</b>, alongside the query rather than inside it, so the server treats it purely as a name to compare against.'
          : 'The identical malicious input now matches <b>nothing</b>, because it was never part of the command. The server looked for a user literally named <code>' +
            esc(v) + '</code> and correctly found none. <b>The attack is not blocked or filtered: it simply has no way in.</b>';
      }
      $('#ij-sql').innerHTML = '<span style="color:var(--muted)">executed:</span> ' + esc(sql);
      $('#ij-tbl').innerHTML = rows === null
        ? '<thead><tr><th>users</th></tr></thead><tbody><tr class="lo"><td>table does not exist</td></tr></tbody>'
        : '<thead><tr><th>id</th><th>name</th><th>role</th></tr></thead><tbody>' +
          (rows.length ? rows.map(r => `<tr class="${mode === 'bad' && inp !== 'ok' ? 'lo' : 'hi'}">` +
            r.map(x => `<td>${x}</td>`).join('') + '</tr>').join('')
            : '<tr><td class="nul" colspan="3">no rows</td></tr>') + '</tbody>';
      $('#ij-mode').textContent = mode === 'bad' ? 'string concatenation' : 'parameterised query';
      $('#ij-verd').textContent = verd;
      $('#ij-note').innerHTML = note;
      const m = $('#f-inj-msg');
      m.className = 'msg ' + cls;
      m.textContent = mode === 'good'
        ? 'a parameterised value can never become part of the command'
        : inp === 'ok' ? 'It happens to work here. That is not the same as being safe.'
          : 'The input crossed the line from data into command, and nothing in the query could stop it.';
    }
    setPills($('#f-inj'), 'ij', v => { inp = v; draw(); });
    setPills($('#f-inj'), 'im', v => { mode = v; draw(); });
    draw();
  })();
}
</script>
