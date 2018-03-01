import React from 'react';
import ReactDOM from 'react-dom';

const NavComponent = React.createClass({
	render: function() {
		return (
			<nav class="navbar navbar-expand-lg navbar-dark bg-dark customnav">
				<a class="navbar-brand logo" href="#">ThePushProgram</a>
				<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>

				<div class="collapse navbar-collapse" id="navbarColor02">
					<ul class="navbar-nav mr-auto">
					<li class="nav-item">
						<a class="nav-link" href="#/allusers">View All</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="#/manageusers">Manage New Users</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="#/addcontent">Add Content</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="#/logout">Logout</a>
					</li>
					</ul>
				</div>
			</nav>
		);
	}
});

ReactDOM.render(<NavComponent />, document.querySelector('navbar'));