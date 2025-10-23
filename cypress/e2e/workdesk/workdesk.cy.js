describe("page renders correct", () => {
  it("workdesk renders correct", () => {
    cy.visit("/#/login").then(() => {
      cy.get('input[placeholder="نام کاربری"]').type("std_admin");
      cy.get('input[placeholder="رمز عبور"]').type("P@ssw0rd");
      cy.wait(4000);
      cy.get('button[class="btn_login_page"]').click();
      cy.wait(1000);
      cy.visit("/#/workdesk");
      //url expect
      cy.url().should("eq", "http://localhost:3000/#/workdesk");
      //datatable className
      cy.get(".dataTableCkassName").should("be.empty");
      cy.intercept(
        "GET",
        "http://ls.arian.co.ir:8081/api/1.0/std/std/categories",
        { fixture: "categories.json" }
      );
      cy.intercept(
        "GET",
        "http://ls.arian.co.ir:8081/api/1.0/std/std/documents",
        { fixture: "documents.json" }
      );
    });
  });

  it("work desk tabs and datatables render and work correct?", () => {
    const categories_tab = cy.get('div[class="categories_datatable"]');
    const tc_sc_tab = cy.get('div[class="tc_sc_datatable"]');
    categories_tab.should("be.visible");
    tc_sc_tab.should("be.visible");
    //tc and sc datatable and columns
    tc_sc_tab.click();
    cy.get(".tcScDatatable").should("be.visible");
    cy.contains("سازمان").should("be.visible");
    cy.contains("کمیته فنی متناظر").should("be.visible");
    cy.contains("موضوع").should("be.visible");
    cy.contains("تاریخ ثبت").should("be.visible");
    cy.contains("تاریخ اعتبار").should("be.visible");
    cy.contains("درج کننده").should("be.visible");
    //docs table and columns
    categories_tab.click();
    cy.get(".docsDataTable").should("be.visible");
    cy.contains("سازمان").should("be.visible");
    cy.contains("کمیته فنی متناظر").should("be.visible");
    cy.contains("موضوع").should("be.visible");
    cy.contains("تاریخ ثبت").should("be.visible");
    cy.contains("تاریخ اعتبار").should("be.visible");
    cy.contains("درج کننده").should("be.visible");
  });

  it('create button work correct?'){
    const categories_tab = cy.get('div[class="categories_datatable"]');
    const tc_sc_tab = cy.get('div[class="tc_sc_datatable"]');
    categories_tab.click();
    cy.get('div[class="modal_div_parent"]').should("be.visible");
    cy.get('button[class="modal_submit_btn"]').click();
    cy.contains('پر کردن فیلد الزامیست').should('be.visible')
    cy.get('input[class="category_title"]').type('test title');
    cy.get('button[class="modal_submit_btn"]').click();
    cy.intercept("POST", 'http://ls.arian.co.ir:8081/api/1.0/std/std/categories');
    cy.get('div[class="modal_div_parent"]').should("not.be.visible");
  }

  it("is datatable search and vist modal ok?", async () => {
    const search_fields_test = (api, fileName) => {
      const organization_search_field = cy.get(
        'input[id="organization_search_field"]'
      );
      const tc_search_field = cy.get('input[id="tc_search_field"]');
      const subject_search_field = cy.get('input[id="subject_search_field"]');
      const submit_date_search_field = cy.get(
        'input[id="organization_search_field"]'
      );
      const expiration_date_search_field = cy.get(
        'input[id="organization_search_field"]'
      );
      const submitter_search_field = cy.get(
        'input[id="organization_search_field"]'
      );
      const db_parent_div = cy.get("./db_parent_div");
      const db_record = db_parent_div[0];
      organization_search_field.type(db_record.organization_search_field);
      tc_search_field.type(db_record.tc_search_field);
      subject_search_field.type(db_record.subject_search_field);
      submit_date_search_field.type(db_record.submit_date_search_field);
      expiration_date_search_field.type(db_record.expiration_date_search_field);
      submitter_search_field.type(db_record.submitter_search_field);
      cy.get('button[id="search_submit_btn"]').click();
      cy.intercept("GET", api, { fixture: fileName });
    };

    const categories_tab = cy.get('div[class="categories_datatable"]');
    const tc_sc_tab = cy.get('div[class="tc_sc_datatable"]');
    categories_tab.click();
    await search_fields_test(
      "http://ls.arian.co.ir:8081/api/1.0/std/std/categories",
      "categories_search.json"
    );
    cy.get('button[class="record_visit_btn"]').click();
    cy.get()
    cy.get('div[class="modal_div_parent"]').should("be.visible");
    tc_sc_tab.click();
    await search_fields_test(
      "http://ls.arian.co.ir:8081/api/1.0/std/std/documents",
      "documents_search.json"
    );
    cy.get('button[class="record_visit_btn"]').click();
    cy.get('div[class="modal_div_parent"]').should("be.visible");
  });
});
