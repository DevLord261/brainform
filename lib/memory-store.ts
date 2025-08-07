import type { Form } from "./types";

// Add ID to the Form type for storage purposes
export type FormWithId = Form & { id: string };
export type Submission = {
  id: string;
  formId: string;
  created_at: Date;
  data: Record<string, string>;
};

const sampleForm: FormWithId = {
  id: "sample-form-1",
  title: "Sample Feedback Form",
  description:
    "A sample form to collect user feedback and showcase functionality.",
  created_at: new Date(new Date().setDate(new Date().getDate() - 7)), // Created 7 days ago
  fields: [
    {
      id: "name",
      type: "text",
      label: "Your Name",
      extraAttributes: { required: true, placeholder: "John Doe" },
    },
    {
      id: "email",
      type: "email",
      label: "Your Email",
      extraAttributes: {
        required: true,
        placeholder: "john.doe@example.com",
      },
    },
    {
      id: "rating",
      type: "rating",
      label: "Your Rating",
      extraAttributes: { maxStars: 5, required: true, defaultValue: 0 },
    },
    {
      id: "feedback",
      type: "textarea",
      label: "Your Feedback",
      extraAttributes: {
        required: true,
        placeholder: "Tell us what you think...",
      },
    },
    {
      id: "department",
      type: "radio",
      label: "Which department did you interact with?",
      extraAttributes: {
        required: true,
        options: ["Sales", "Support", "Engineering", "Marketing"],
      },
    },
  ],
  theme: "default",
  saveToDatabase: true,
  tableName: "feedback_submissions",
  recaptchaSettings: {
    enabled: false,
    invisible: true,
    siteKey: "",
    secretKey: "",
  },
};

class MemoryStore {
  private static instance: MemoryStore;
  private forms: Map<string, FormWithId>;
  private submissions: Map<string, Submission[]>;

  private constructor() {
    this.forms = new Map();
    this.submissions = new Map();
    this.seedData();
  }

  private seedData() {
    if (this.forms.size === 0) {
      this.saveForm(sampleForm);
    }
    if ((this.getSubmissions(sampleForm.id) || []).length === 0) {
      // Generate random submissions for the current month to showcase the graph
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      const sampleSubmissions = [];

      // Generate random data for each day of the current month
      for (let day = 1; day <= daysInMonth; day++) {
        const submissionDate = new Date(currentYear, currentMonth, day);
        const randomSubmissionCount = Math.floor(Math.random() * 15); // 0-14 submissions per day

        for (let i = 0; i < randomSubmissionCount; i++) {
          const names = [
            "Alice",
            "Bob",
            "Charlie",
            "Diana",
            "Eve",
            "Frank",
            "Grace",
            "Heidi",
            "Ivan",
            "Julia",
            "Kevin",
            "Luna",
            "Mike",
            "Nina",
            "Oscar",
            "Paula",
          ];
          const departments = ["Sales", "Support", "Engineering", "Marketing"];
          const feedbacks = [
            "Excellent service!",
            "Very good, but could be faster.",
            "Good experience overall.",
            "It was okay.",
            "Loved it! Will use again.",
            "Not what I expected.",
            "Helpful staff.",
            "Perfect!",
            "Could be improved.",
            "Amazing experience!",
            "Quick and efficient.",
            "Professional service.",
            "Exceeded expectations.",
            "Satisfactory service.",
            "Outstanding quality!",
          ];

          const randomName = names[Math.floor(Math.random() * names.length)];
          const randomDepartment =
            departments[Math.floor(Math.random() * departments.length)];
          const randomFeedback =
            feedbacks[Math.floor(Math.random() * feedbacks.length)];
          const randomRating = Math.floor(Math.random() * 5) + 1;

          sampleSubmissions.push({
            name: `${randomName}${i > 0 ? ` ${i + 1}` : ""}`,
            email: `${randomName.toLowerCase()}${i > 0 ? i + 1 : ""}@example.com`,
            rating: randomRating,
            feedback: randomFeedback,
            department: randomDepartment,
            date: submissionDate,
          });
        }
      }

      sampleSubmissions.forEach((sub) => {
        const submissionData: Record<string, string> = {
          "Your Name": sub.name,
          "Your Email": sub.email,
          "Your Rating": sub.rating.toLocaleString(),
          "Your Feedback": sub.feedback,
          "Which department did you interact with?": sub.department,
        };

        const submission: Submission = {
          id: crypto.randomUUID(),
          formId: sampleForm.id,
          created_at: sub.date,
          data: submissionData,
        };

        const formSubmissions = this.submissions.get(sampleForm.id) || [];
        formSubmissions.push(submission);
        this.submissions.set(sampleForm.id, formSubmissions);
      });
    }
  }

  public static getInstance(): MemoryStore {
    if (!MemoryStore.instance) {
      MemoryStore.instance = new MemoryStore();
    }
    return MemoryStore.instance;
  }

  saveForm(form: FormWithId): FormWithId {
    this.forms.set(form.id, form);
    return form;
  }

  getForm(id: string): FormWithId | undefined {
    return this.forms.get(id);
  }

  getAllForms(): FormWithId[] {
    return Array.from(this.forms.values());
  }

  saveSubmission(formId: string, data: Record<string, string>): Submission {
    const submission: Submission = {
      id: crypto.randomUUID(),
      formId,
      created_at: new Date(),
      data,
    };
    const formSubmissions = this.submissions.get(formId) || [];
    formSubmissions.push(submission);
    this.submissions.set(formId, formSubmissions);
    return submission;
  }

  getSubmissions(formId: string): Submission[] {
    return this.submissions.get(formId) || [];
  }
}

export const memoryStore = MemoryStore.getInstance();
