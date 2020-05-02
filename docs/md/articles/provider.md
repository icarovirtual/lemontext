# Dynamic Attribute Provider - Django
###### Published on May/20

Honestly, sometimes I get tired of having to write "boilerplatish" code repeatedly in my projects because they are needed in to achieve very simple algorithm tasks that are used multiple times during development.  
Examples of that involve retrieving and using: URL arguments, `GET` parameters and `cleaned_data` from a form.
```python
class MyForm(Form):
    
    # Your form goes here
    pass

class MyView(FormView):
    
    form_class = MyForm

    def get(self, request, *args, **kwargs):
        arg_1 = self.kwargs['arg_1']
        arg_2 = self.kwargs['arg_2']
        # Default value
        param = 10
        if 'param' in self.GET:
            param = self.GET['param']
        var_x = arg_1 * arg_2
        self.some_func(var_x, param)
    
    def form_valid(self, form):
        field_1 = form.cleaned_data['field_1']
        field_2 = form.cleaned_data['field_2']
        field_3 = form.cleaned_data['field_3']
        var_1 = field_1 + field_2
        var_2 = field_1 * field_3
        self.other_func(var_1, var_2)
``` 
It is already **known** that arguments come from `kwargs`, parameters come from `request.GET` and form data comes from `form.cleaned_data`. Why is it necessary to write all of that everytime those structures are used?

Looking for ways to improve that I learned about Python's `__getattr__` function and created a simple class that can be helpful in these situations and many others.
```python
class AttrProviderMixin(object):

    is_providing = False

    def can_provide_attr(self, attr):
        # Validate in the class' attributes that it's possible to retrieve the
        # expected dynamic attribute
        return False

    def provide_attr(self, attr):
        # Retrieve the value of the requested dynamic attribute
        return None

    def default_for_attr(self, attr):
        # Define a default value for the attribute
        return None

    def __getattr__(self, item):
        """ Intercept an invalid attribute check to provide the dynamic value. """
        try:
            return super().__getattr__(item)
        except AttributeError:
            # Try to detect an attribute validation loop and avoid it by
            # raising the error of an invalid attribute
            if self.is_providing:
                self.is_providing = False
                raise
            # Mark that it's trying to retrieve the attribute to avoid loops
            self.is_providing = True
            # Subclass can provide a default value
            default = self.default_for_attr(item)
            # If it's an unexpected attribute with no default value, the
            # dynamic attribute is not valid in this class
            if not self.can_provide_attr(item) and default is None:
                self.is_providing = False
                raise AttributeError("It was not possible to provide the attribute \"%s\" in %r. "
                                     "Check its availability in the current context." % (item, self))
            # Get the dynamic attribute value, uncheck that it's being
            # retrieved and return it
            attr_value = self.provide_attr(item)
            self.is_providing = False
            return attr_value or default
```
To put simply, this class overrides the `__getattr__` behavior and tries to retrieve the requested attributes using the functions it provides that the subclasses must implement.

From that base class, specific mixins can provide the attributes that can be retrieved in the available scope. Below are examples for the values mentioned before.
```python
class CleanedDataProviderMixin(AttrProviderMixin):
    """ Provides values from `form.cleaned_data`. """

    def can_provide_attr(self, attr):
        return self.fields and attr in self.fields

    def provide_attr(self, attr):
        return self.cleaned_data.get(attr, None)

class KwargsOrGetProviderMixin(AttrProviderMixin):
    """ Provides values from the view's `kwargs` or GET parameters. """

    def can_provide_attr(self, attr):
        return \
            self.kwargs and attr in self.kwargs or \
            self.request.GET and attr in self.request.GET

    def provide_attr(self, attr):
        return \
            self.kwargs.get(attr, None) or \
            self.request.GET.get(attr, None)

    def default_for_attr(self, attr):
        if attr == 'param':
            return 10
        return None
```
To provide `cleaned_data`, the field must exist in the form and then it's retrieved from `cleaned_data` itself. As for `kwargs` and `GET`, the key must exist and then it's also simply retrieved from those attributes. 

Finally, by adding those classes to the previous `Form` and `View`, retrieving the values can be done directly on the `self` instance, as if they were class attributes.
```python
class MyForm(CleanedDataProviderMixin, Form):
    
    # Your form goes here
    pass

class MyView(KwargsOrGetProviderMixin, FormView):
    
    form_class = MyForm

    def get(self, request, *args, **kwargs):
        var_x = self.arg_1 * self.arg_2
        self.some_func(var_x, self.param)
    
    def form_valid(self, form):
        var_1 = self.field_1 + self.field_2
        var_2 = self.field_1 * self.field_3
        self.other_func(var_1, var_2)
```
**Ain't that better?**  
Of course it's necessary to check for conflicts with other attributes but most of the time I found that this improves my productivity and despite being unusual at first, it's very easy to understand and use this mechanism.

---

All the source code shown and explained here (mixins, functions, examples, samples, etc.) is available in the `lemoncode` repository along with other helpful projects I’ve developed and wrote about. Feel free to check it out, use them in your own work and help me improve them with your feedback 🍋 🍋 🍋

> :Buttons
> > :Button label=See it on GitHub, url=https://github.com/icarovirtual/lemoncode/blob/master/provider/

> :ToCPrevNext