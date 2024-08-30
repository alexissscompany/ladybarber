document.addEventListener("DOMContentLoaded", () => {
  const datePicker = document.getElementById("date-picker");
  const timeSection = document.getElementById("time-section");
  const timePicker = document.getElementById("time-picker");
  const descriptionSection = document.getElementById("description-section");
  const description = document.getElementById("description");
  const submitButton = document.getElementById("submit-button");
  const confirmationBox = document.getElementById("confirmation-box");
  const confirmationDetails = document.getElementById("confirmation-details");
  const infoSection = document.getElementById("info-section");
  const infoDetails = document.getElementById("info-details");
  const dateWarning = document.getElementById("date-warning");
  const viewListLink = document.getElementById("view-list");

  let selectedDate = "";
  let selectedTime = "";
  const bookedSlots = new Set(); // To store booked slots

  function populateTimes() {
    const startHour = 11;
    const endHour = 20;
    timePicker.innerHTML = ""; // Clear previous times
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour
          .toString()
          .padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        if (!bookedSlots.has(time)) {
          const timeSlot = document.createElement("div");
          timeSlot.className = "time-slot";
          timeSlot.innerHTML = `<input type="radio" name="time" value="${time}"> ${time}`;
          timeSlot.querySelector("input").addEventListener("change", () => {
            selectedTime = time;
          });
          timePicker.appendChild(timeSlot);
        }
      }
    }
  }

  function updateConfirmation() {
    confirmationDetails.innerHTML = `
            <p><strong>Fecha:</strong> ${selectedDate}</p>
            <p><strong>Hora:</strong> ${selectedTime}</p>
            <p><strong>Descripción:</strong> ${description.value}</p>
        `;
  }

  function updateInfoSection() {
    infoDetails.innerHTML = `
            <p><strong>Fecha:</strong> ${selectedDate}</p>
            <p><strong>Hora:</strong> ${selectedTime}</p>
            <p><strong>Descripción:</strong> ${description.value}</p>
        `;
  }

  datePicker.addEventListener("change", () => {
    selectedDate = datePicker.value;
    const date = new Date(selectedDate);
    const day = date.getDay();

    if (day === 3) {
      // Wednesday
      dateWarning.textContent = "No hay citas disponibles los miércoles.";
      timeSection.style.display = "none";
      descriptionSection.style.display = "none";
      submitButton.style.display = "none";
    } else {
      dateWarning.textContent = "";
      timeSection.style.display = "block";
      descriptionSection.style.display = "block";
      submitButton.style.display = "block";
      populateTimes();
    }
  });

  timePicker.addEventListener("change", () => {
    // Ensure the description section and submit button are displayed
    descriptionSection.style.display = "block";
    submitButton.style.display = "block";
  });

  submitButton.addEventListener("click", () => {
    if (selectedDate && selectedTime && description.value) {
      bookedSlots.add(selectedTime); // Book the slot

      const appointment = {
        date: selectedDate,
        time: selectedTime,
        description: description.value
      };

      // Save appointment to local storage
      let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
      appointments.push(appointment);
      localStorage.setItem("appointments", JSON.stringify(appointments));

      updateConfirmation();
      updateInfoSection();
      confirmationBox.style.display = "block";
      viewListLink.style.display = "block";
    }
  });
});
