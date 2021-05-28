const db = firebase.firestore();

const taskForm = document.getElementById("task-form");
const tasksContainer = document.getElementById("tasks-container");

let editStatus = false;
let id = '';

/**
 * Save a New Task in Firestore
 * @param {string} name the name of the Task
 * @param {string} imageLocation
 * @param {string} iconLocation
 * @param {string} roomLocation
 * @param {string} detail the imageLocation of the Task
 */
const saveTask = (name, imageLocation, iconLocation, roomLocation, detail) =>
  db.collection("poster").doc().set({
    name,
    imageLocation,
    iconLocation,
    roomLocation,
    detail,
  });

const getTasks = () => db.collection("poster").get();

const onGetTasks = (callback) => db.collection("poster").onSnapshot(callback);

const deleteTask = (id) => db.collection("poster").doc(id).delete();

const getTask = (id) => db.collection("poster").doc(id).get();

const updateTask = (id, updatedTask) => db.collection('poster').doc(id).update(updatedTask);

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetTasks((querySnapshot) => {
    tasksContainer.innerHTML = "";


    querySnapshot.forEach((doc) => {
      const task = doc.data();

      tasksContainer.innerHTML += `<div class="card card-body mt-2 border-primary">
    <h3 class="h5">${task.name}</h3>
    <p>${task.imageLocation}</p>
    <p>${task.iconLocation}</p>
    <p>${task.roomLocation}</p>
    <p>${task.detail}</p>

    <div>
      <button class="btn btn-primary btn-delete" data-id="${doc.id}">
        🗑 Delete
      </button>
      <button class="btn btn-secondary btn-edit" data-id="${doc.id}">
        🖉 Edit
      </button>
    </div>
  </div>`;
    });

    const btnsDelete = tasksContainer.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) =>
      btn.addEventListener("click", async (e) => {
        console.log(e.target.dataset.id);
        window.alert('Delete success');
        try {
          await deleteTask(e.target.dataset.id);
        } catch (error) {
          console.log(error);
        }
      })
    );

    const btnsEdit = tasksContainer.querySelectorAll(".btn-edit");
    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        try {
          const doc = await getTask(e.target.dataset.id);
          const task = doc.data();
          taskForm["task-name"].value = task.name;
          taskForm["task-imageLocation"].value = task.imageLocation;
          taskForm["task-iconLocation"].value = task.iconLocation;
          taskForm["task-roomLocation"].value = task.roomLocation;
          taskForm["task-detail"].value = task.detail;

          editStatus = true;
          id = doc.id;
          taskForm["btn-task-form"].innerText = "Update";

        } catch (error) {
          console.log(error);
        }
      });
    });
  });
});

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = taskForm["task-name"];
  const imageLocation = taskForm["task-imageLocation"];
  const iconLocation = taskForm["task-iconLocation"];
  const roomLocation = taskForm["task-roomLocation"];
  const detail = taskForm["task-detail"];

  try {
    if (!editStatus) {
      await saveTask(name.value, imageLocation.value, iconLocation.value, roomLocation.value, detail.value);
    } else {
      await updateTask(id, {
        name: name.value,
        imageLocation: imageLocation.value,
        iconLocation: iconLocation.value,
        roomLocation: roomLocation.value,
        detail: detail.value,
      })

      editStatus = false;
      id = '';
      taskForm['btn-task-form'].innerText = 'Save';
    }

    taskForm.reset();
    name.focus();
  } catch (error) {
    console.log(error);
  }

});

// เมื่อผู้ใช้เลื่อนหน้าเว็บจะรัน myFunction
window.onscroll = function () { myFunction() };

// Get the navbar
var navbar = document.getElementById("navbar");

// Get ตำแหน่งออฟเซตของ navbar
var sticky = navbar.offsetTop;


// เพิ่ม sticky ลงใน navbar เมื่อคุณไม่ได้เลื่อน "sticky" จะถูกลบออก
function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}

