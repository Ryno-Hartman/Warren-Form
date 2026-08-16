const form = document.querySelector("#consultation-form");
const submitButton = document.querySelector("#submit-button");
const submitLabel = submitButton.querySelector("span");
const formStatus = document.querySelector("#form-status");
const formHeader = document.querySelector(".form-header");
const errorSummary = document.querySelector("#error-summary");
const errorList = document.querySelector("#error-list");
const interestGroup = document.querySelector("#interest-group");
const contactGroup = document.querySelector("#contact-group");
const phoneField = document.querySelector("#phone");
const phoneRequirementLabel = document.querySelector("label[for='phone'] .optional");
const message = document.querySelector("#message");
const messageCount = document.querySelector("#message-count");
const successPanel = document.querySelector("#success-panel");
const successMessage = document.querySelector("#success-message");
const newRequestButton = document.querySelector("#new-request");

const fieldMessages = {
  "full-name": "Please enter your full name.",
  email: "Please enter your email address.",
  phone: "Please enter a phone number if you prefer to be contacted by phone.",
  "primary-goal": "Please choose your main financial goal.",
  consent: "Please agree to be contacted about this request.",
};

function getFieldLabel(field) {
  const label = document.querySelector(`label[for="${field.id}"]`);
  return label?.textContent.replace("*", "").replace("Optional", "").trim() || "This field";
}

function setFieldError(field, messageText) {
  const error = document.querySelector(`#${field.id}-error`);
  field.setAttribute("aria-invalid", "true");
  if (error) error.textContent = messageText;
}

function clearFieldError(field) {
  const error = document.querySelector(`#${field.id}-error`);
  field.removeAttribute("aria-invalid");
  if (error) error.textContent = "";
}

function fieldErrorMessage(field) {
  if (field.id === "email" && field.validity.typeMismatch) {
    return "Email address needs an @ symbol and a domain, such as name@example.com.";
  }

  return fieldMessages[field.id] || `Please complete ${getFieldLabel(field).toLowerCase()}.`;
}

function validateForm() {
  syncPhoneRequirement();
  const errors = [];
  const requiredFields = [...form.querySelectorAll("input[required]:not([type='radio']), select[required]")];

  requiredFields.forEach((field) => {
    if (!field.validity.valid) {
      const messageText = fieldErrorMessage(field);
      setFieldError(field, messageText);
      errors.push({ id: field.id, message: messageText });
    } else {
      clearFieldError(field);
    }
  });

  const selectedInterests = form.querySelectorAll("input[name='interest']:checked");
  const interestError = document.querySelector("#interest-error");
  const interestChoices = interestGroup.querySelectorAll("input[name='interest']");
  if (selectedInterests.length === 0) {
    interestGroup.setAttribute("aria-invalid", "true");
    interestChoices.forEach((choice) => choice.setAttribute("aria-invalid", "true"));
    interestError.textContent = "Please choose at least one topic to discuss.";
    errors.push({ id: interestChoices[0].id || "interest-group", message: interestError.textContent, target: "interest-group" });
  } else {
    interestGroup.removeAttribute("aria-invalid");
    interestChoices.forEach((choice) => choice.removeAttribute("aria-invalid"));
    interestError.textContent = "";
  }

  const contactChoice = form.querySelector("input[name='contact-method']:checked");
  const contactError = document.querySelector("#contact-error");
  const contactChoices = contactGroup.querySelectorAll("input[name='contact-method']");
  if (!contactChoice) {
    contactGroup.setAttribute("aria-invalid", "true");
    contactChoices.forEach((choice) => choice.setAttribute("aria-invalid", "true"));
    contactError.textContent = "Please choose how you would like to be contacted.";
    errors.push({ id: "contact-group", message: contactError.textContent, target: "contact-group" });
  } else {
    contactGroup.removeAttribute("aria-invalid");
    contactChoices.forEach((choice) => choice.removeAttribute("aria-invalid"));
    contactError.textContent = "";
  }

  renderErrorSummary(errors);
  return errors.length === 0;
}

function renderErrorSummary(errors) {
  errorList.replaceChildren();

  if (errors.length === 0) {
    errorSummary.hidden = true;
    return;
  }

  errors.sort((first, second) => {
    const firstElement = document.querySelector(`#${first.target || first.id}`);
    const secondElement = document.querySelector(`#${second.target || second.id}`);
    if (!firstElement || !secondElement) return 0;
    return firstElement.compareDocumentPosition(secondElement) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });

  errors.forEach(({ id, message: messageText, target }) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${target || id}`;
    link.textContent = messageText;
    item.append(link);
    errorList.append(item);
  });

  errorSummary.hidden = false;
}

function encodeFormData(formData) {
  return new URLSearchParams(formData).toString();
}

function isLocalPreview() {
  return location.protocol === "file:" || ["localhost", "127.0.0.1"].includes(location.hostname);
}

function syncPhoneRequirement() {
  const selectedMethod = form.querySelector("input[name='contact-method']:checked")?.value;
  const phoneIsRequired = selectedMethod === "Phone";
  phoneField.toggleAttribute("required", phoneIsRequired);
  phoneRequirementLabel.textContent = phoneIsRequired ? "Required when phone is selected" : "Optional";

  if (!phoneIsRequired) clearFieldError(phoneField);
}

async function submitForm(event) {
  event.preventDefault();
  formStatus.textContent = "";

  if (!validateForm()) {
    errorSummary.focus();
    return;
  }

  submitButton.disabled = true;
  submitLabel.textContent = "Sending request…";

  try {
    if (isLocalPreview()) {
      await new Promise((resolve) => window.setTimeout(resolve, 450));
      successMessage.textContent = "This local preview is working. Once deployed to Netlify, completed requests will appear in the site’s Forms area.";
    } else {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeFormData(new FormData(form)),
      });

      if (!response.ok) throw new Error("Submission failed");
    }

    form.hidden = true;
    formHeader.hidden = true;
    document.querySelector(".privacy-notice").hidden = true;
    errorSummary.hidden = true;
    successPanel.hidden = false;
    successPanel.focus();
    form.reset();
    syncPhoneRequirement();
    messageCount.textContent = "0 / 1000";
  } catch {
    formStatus.textContent = "We couldn’t send your request. Check your connection and try again.";
  } finally {
    submitButton.disabled = false;
    submitLabel.textContent = "Request a consultation";
  }
}

function resetFormView() {
  successPanel.hidden = true;
  formHeader.hidden = false;
  document.querySelector(".privacy-notice").hidden = false;
  form.hidden = false;
  document.querySelector("#full-name").focus();
}

form.addEventListener("submit", submitForm);

form.addEventListener("input", (event) => {
  const field = event.target;
  if (field.matches("input, select, textarea") && field.id) clearFieldError(field);

  if (field.name === "interest" && form.querySelector("input[name='interest']:checked")) {
    interestGroup.removeAttribute("aria-invalid");
    interestGroup.querySelectorAll("input").forEach((choice) => choice.removeAttribute("aria-invalid"));
    document.querySelector("#interest-error").textContent = "";
  }

  if (field.name === "contact-method") {
    syncPhoneRequirement();
    contactGroup.removeAttribute("aria-invalid");
    contactGroup.querySelectorAll("input").forEach((choice) => choice.removeAttribute("aria-invalid"));
    document.querySelector("#contact-error").textContent = "";
  }

  errorSummary.hidden = true;
});

form.addEventListener("focusout", (event) => {
  const field = event.target;
  if (!field.matches("input[required]:not([type='radio']), select[required]")) return;

  if (!field.validity.valid) {
    setFieldError(field, fieldErrorMessage(field));
  }
});

message.addEventListener("input", () => {
  messageCount.textContent = `${message.value.length} / 1000`;
});

newRequestButton.addEventListener("click", resetFormView);
syncPhoneRequirement();
