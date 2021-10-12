function validation(formElement) {
    const formRules = {};


    function findParent(input, inputParent) {
        while (input.parentElement) {
            if (input.parentElement.matches(inputParent)) {
                return input.parentElement;
            }
            return input.parentElement
        }
    }


    const ruleOut = {
        required: function(value) {
            return value ? undefined : 'Vui lòng nhập trường này!';
        },
        email: function(value) {
            const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập đúng định dạng email này!';
        },
        min: function(min) {
            return (value) => {
                return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} ký tự`;
            };
        },
        max: function(max) {
            return (value) => {
                return value.length <= max ? undefined : `Vui lòng nhập tối đa ${max} ký tự`;
            };
        }
    }



    const form = document.querySelector(formElement);
    const inputs = form.querySelectorAll('[rules]');
    inputs.forEach((item) => {
        let rules;
        let name = item.name;
        rules = item.getAttribute('rules').split('|');

        rules.forEach((rule) => {
            let parameter;
            if (rule.split(':').length == 2) {
                parameter = rule.split(':')[1];
                rule = rule.split(':')[0];
            }

            if (Array.isArray(formRules[name])) {
                if (parameter != null) {
                    formRules[name].push(ruleOut[rule](parameter));
                } else { formRules[name].push(ruleOut[rule]) };
            } else {
                if (parameter != null) {
                    formRules[name].push(ruleOut[rule](parameter));
                } else { formRules[name] = [ruleOut[rule]]; };
            }
        })

    });




    inputs.forEach(function(input) {
        input.onblur = handlerInputBlur;
        input.oninput = function(e) {
            const formGroup = findParent(e.target, '.form__group');
            const errorMessage = formGroup.querySelector('.errorMessage');
            formGroup.classList.remove('invalid');
            errorMessage.innerText = '';
        };
    })



    function handlerInputBlur(e) {
        const formGroup = findParent(e.target, '.form__group');
        const errorMessage = formGroup.querySelector('.errorMessage');
        takeRuleResult(e.target.name, e.target, errorMessage, formGroup)
    };



    function takeRuleResult(nameRule, input, errorMessage, formGroup) {
        formRules[nameRule].forEach((rule) => {
            if (rule(input.value)) {
                formGroup.classList.add('invalid');
                errorMessage.innerText = rule(input.value);
            }
        });
    }


    form.onsubmit = (e) => {
        e.preventDefault();
        inputs.forEach((input) => {
            handlerInputBlur({
                target: input
            });
        })
    };
}