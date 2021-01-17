First problem I had was to install ROS2 along ROS using an external hard drive. That is, I want to have access to both ROS and ROS2 and use my external hard drive for storage purposes.
lxd and virtual machines are possible solutions.

- [How to install ROS using linux containers LXD](https://ubuntu.com/blog/ros-development-with-lxd) #ros #howto
- https://www.digitalocean.com/community/tutorials/how-to-set-up-and-use-lxd-on-ubuntu-16-04


```cpp
int main() {
   World world{};
    Agent a;
	world.register(a);
	while(ros_ok) {
	   world.step()
	}
}

World::step() {
// comms sim
// for 
}
Agent::observe(World& world) {
	// world
	
}

Agent::step() {
	mm.step();
	publish_state();
}

/// Workd with 2 agents and communication

Eigen + Sophus (differentail geometry) 
```


Nodelet: zero copy message passing and you can load dynamically
Today at 

## Resources 
- [Robotics Recap: Learning, Programming & Snapping ROS 2](https://ubuntu.com/blog/robotics-recap-learning-programming-and-snapping-ros-2) I learned about lxd (linux containers) and how we can use them to install ROS from articles in here.
- [ROS 2 tutorials](https://index.ros.org/doc/ros2/Tutorials/)
- [ROS 2 Video tutorials from the construct](https://www.youtube.com/playlist?list=PLK0b4e05LnzYNBzqXNm9vFD9YXWp6honJ)
- [Install ROS in an LXD Container](https://www.youtube.com/watch?v=bFJp7WAfcXk&feature=emb_title)
- [Roscon videos](https://index.ros.org/doc/ros2/ROSCon-Content/) #video #conference #ros 